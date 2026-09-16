"""AI router - all Gemini-powered endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from fastapi import Request
from sqlalchemy.orm import Session
from datetime import datetime
import json

from database import get_db
from models import (Trainee, TraineeSkill, Enrollment, AssessmentAttempt,
                    Assessment, AIRecommendation, Job, JobSkill, Skill, Course)
from schemas import (CareerRecommendationRequest, SkillGapRequest,
                     CourseRecommendationRequest, JobMatchRequest,
                     ChatRequest, CareerRecommendationResponse)
from services import gemini_service

router = APIRouter()


def _build_trainee_context(trainee_id: int, db: Session) -> dict:
    """Build trainee data dict to send to Gemini (no sensitive PII)."""
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")

    # Skills
    skills = db.query(TraineeSkill).filter(TraineeSkill.trainee_id == trainee_id).all()
    skills_list = [
        {"name": ts.skill.name, "category": ts.skill.category, "proficiency": ts.proficiency}
        for ts in skills if ts.skill
    ]

    # Completed courses with scores
    completed_enrollments = db.query(Enrollment).filter(
        Enrollment.trainee_id == trainee_id,
        Enrollment.status == "completed"
    ).all()

    completed_courses = []
    for e in completed_enrollments:
        if e.course:
            # Find best assessment score for this course
            best_attempt = db.query(AssessmentAttempt).join(Assessment).filter(
                AssessmentAttempt.trainee_id == trainee_id,
                Assessment.course_id == e.course_id,
                AssessmentAttempt.status == "passed"
            ).order_by(AssessmentAttempt.score.desc()).first()
            completed_courses.append({
                "title": e.course.title,
                "score": best_attempt.score if best_attempt else None
            })

    return {
        "name": trainee.name,
        "location": trainee.location or "India",
        "state": trainee.state,
        "education": trainee.education,
        "employment_status": str(trainee.employment_status),
        "skills": skills_list,
        "completed_courses": completed_courses,
    }


@router.post("/career-recommendation")
def get_career_recommendation(
    req: CareerRecommendationRequest,
    db: Session = Depends(get_db)
):
    """Generate AI career recommendation for a trainee."""
    # Check for cached recommendation (unless force_refresh)
    if not req.force_refresh:
        cached = db.query(AIRecommendation).filter(
            AIRecommendation.trainee_id == req.trainee_id,
            AIRecommendation.recommendation_type == "career"
        ).order_by(AIRecommendation.created_at.desc()).first()

        if cached:
            try:
                response_data = json.loads(cached.response)
                response_data["generated_at"] = cached.created_at.isoformat()
                response_data["from_cache"] = True
                return response_data
            except Exception:
                pass

    trainee_data = _build_trainee_context(req.trainee_id, db)

    # Get available jobs
    jobs = db.query(Job).filter(Job.status == "active").limit(10).all()
    jobs_list = []
    for job in jobs:
        job_skills = [
            {"skill_name": js.skill.name, "required_level": js.required_level}
            for js in job.required_skills if js.skill
        ]
        jobs_list.append({
            "title": job.title,
            "employer": job.employer.organization_name if job.employer else "Employer",
            "location": job.location,
            "required_skills": [js["skill_name"] for js in job_skills]
        })

    result = gemini_service.generate_career_recommendation(trainee_data, jobs_list)

    # Store recommendation
    ai_rec = AIRecommendation(
        trainee_id=req.trainee_id,
        recommendation_type="career",
        input_snapshot=json.dumps({"skills_count": len(trainee_data["skills"]), "location": trainee_data["location"]}),
        response=json.dumps(result),
        created_at=datetime.utcnow()
    )
    db.add(ai_rec)
    db.commit()

    result["generated_at"] = ai_rec.created_at.isoformat()
    result["from_cache"] = False
    return result


@router.post("/skill-gap")
def analyze_skill_gap(req: SkillGapRequest, db: Session = Depends(get_db)):
    """Analyze skill gap between trainee and a specific job."""
    trainee_skills = db.query(TraineeSkill).filter(
        TraineeSkill.trainee_id == req.trainee_id
    ).all()
    skills_list = [
        {"name": ts.skill.name, "proficiency": ts.proficiency}
        for ts in trainee_skills if ts.skill
    ]

    job = db.query(Job).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job_requirements = [
        {"skill_name": js.skill.name, "required_level": js.required_level}
        for js in job.required_skills if js.skill
    ]

    result = gemini_service.analyze_skill_gap(skills_list, job_requirements, job.title)

    # Also return numeric data for chart
    result["job_title"] = job.title
    result["job_id"] = req.job_id
    result["chart_data"] = []
    for req_skill in job_requirements:
        candidate_skill = next(
            (s for s in skills_list if s["name"].lower() == req_skill["skill_name"].lower()),
            {"proficiency": 0}
        )
        result["chart_data"].append({
            "skill": req_skill["skill_name"],
            "required": req_skill["required_level"],
            "candidate": candidate_skill["proficiency"],
            "gap": max(0, req_skill["required_level"] - candidate_skill["proficiency"])
        })

    return result


@router.post("/course-recommendation")
def get_course_recommendations(req: CourseRecommendationRequest, db: Session = Depends(get_db)):
    """Recommend next courses for a trainee."""
    trainee_data = _build_trainee_context(req.trainee_id, db)

    all_courses = db.query(Course).all()
    completed_ids = [c["title"] for c in trainee_data["completed_courses"]]
    available_courses = [
        {"title": c.title, "description": c.description or "", "category": c.category}
        for c in all_courses if c.title not in completed_ids
    ]

    result = gemini_service.recommend_courses(trainee_data, available_courses)

    # Store in ai_recommendations
    ai_rec = AIRecommendation(
        trainee_id=req.trainee_id,
        recommendation_type="course",
        input_snapshot=json.dumps({"completed_courses": completed_ids}),
        response=json.dumps(result),
        created_at=datetime.utcnow()
    )
    db.add(ai_rec)
    db.commit()

    result["generated_at"] = ai_rec.created_at.isoformat()
    return result


@router.post("/job-match")
def get_job_match(req: JobMatchRequest, db: Session = Depends(get_db)):
    """AI-powered job matching for a specific trainee-job pair."""
    trainee_data = _build_trainee_context(req.trainee_id, db)

    job = db.query(Job).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job_skills = [
        {"skill_name": js.skill.name, "required_level": js.required_level}
        for js in job.required_skills if js.skill
    ]
    job_data = {
        "title": job.title,
        "employer": job.employer.organization_name if job.employer else "Employer",
        "location": job.location,
        "description": job.description or "",
        "required_skills": job_skills
    }

    result = gemini_service.match_candidate_to_job(trainee_data, job_data)
    result["job_id"] = req.job_id
    result["job_title"] = job.title
    result["generated_at"] = datetime.utcnow().isoformat()
    return result


@router.post("/chat")
def career_chat(req: ChatRequest, db: Session = Depends(get_db)):
    """Conversational AI career guidance."""
    trainee_context = _build_trainee_context(req.trainee_id, db)
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    response = gemini_service.career_chat(messages, trainee_context)
    return {
        "response": response,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/skill-demand")
def get_skill_demand_intelligence(db: Session = Depends(get_db)):
    """Admin: AI analysis of skill demand vs training supply."""
    all_skills = [{"name": s.name, "category": s.category} for s in db.query(Skill).all()]

    active_jobs = db.query(Job).filter(Job.status == "active").all()
    jobs_data = [
        {
            "title": j.title,
            "required_skills": [js.skill.name for js in j.required_skills if js.skill]
        }
        for j in active_jobs
    ]

    courses_data = [{"title": c.title} for c in db.query(Course).all()]

    result = gemini_service.analyze_skill_demand(all_skills, jobs_data, courses_data)
    result["generated_at"] = datetime.utcnow().isoformat()
    return result
