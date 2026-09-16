"""Attendance, Assessments, Certificates, and Jobs routers."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime
import json, hashlib

from database import get_db
from models import (Attendance, Course, Trainee, Enrollment, Assessment,
                    AssessmentQuestion, AssessmentAttempt, TraineeSkill,
                    CourseSkill, Certificate, Notification, Job, JobSkill,
                    JobApplication, Employer)

# ── Attendance ────────────────────────────────────────────────────────────────

attendance_router = APIRouter()


@attendance_router.post("/qr-scan")
def record_qr_attendance(payload: dict, db: Session = Depends(get_db)):
    trainee_id = payload.get("trainee_id")
    course_id = payload.get("course_id")

    if not trainee_id or not course_id:
        raise HTTPException(status_code=400, detail="trainee_id and course_id required")

    # Check duplicate today
    today = date.today()
    existing = db.query(Attendance).filter(
        Attendance.trainee_id == trainee_id,
        Attendance.course_id == course_id,
        Attendance.date == today
    ).first()
    if existing:
        return {
            "success": True,
            "message": "Attendance already recorded for today",
            "status": existing.status,
            "check_in_time": existing.check_in_time,
            "duplicate": True
        }

    # Count sessions for this course
    session_count = db.query(Attendance).filter(
        Attendance.trainee_id == trainee_id,
        Attendance.course_id == course_id
    ).count()

    now = datetime.now()
    record = Attendance(
        trainee_id=trainee_id,
        course_id=course_id,
        date=today,
        status="present",
        method="QR",
        check_in_time=now.strftime("%I:%M %p"),
        session_number=session_count + 1
    )
    db.add(record)

    # Notification
    notif = Notification(
        trainee_id=trainee_id,
        title="Attendance Recorded ✓",
        message=f"Your attendance has been marked for today's session at {now.strftime('%I:%M %p')}.",
        type="success",
        created_at=datetime.utcnow()
    )
    db.add(notif)
    db.commit()

    return {
        "success": True,
        "message": "Attendance recorded successfully",
        "status": "present",
        "check_in_time": now.strftime("%I:%M %p"),
        "date": today.isoformat(),
        "method": "QR Verification",
        "session_number": session_count + 1,
        "duplicate": False
    }


@attendance_router.get("/{trainee_id}/summary")
def get_attendance_summary(trainee_id: int, course_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Attendance).filter(Attendance.trainee_id == trainee_id)
    if course_id:
        query = query.filter(Attendance.course_id == course_id)

    records = query.order_by(Attendance.date.desc()).all()
    present = sum(1 for r in records if r.status == "present")
    total = len(records)

    return {
        "total_sessions": total,
        "present": present,
        "absent": total - present,
        "attendance_rate": round((present / total * 100) if total > 0 else 0, 1),
        "records": [
            {
                "id": r.id,
                "date": r.date.isoformat(),
                "status": r.status,
                "method": r.method,
                "check_in_time": r.check_in_time,
                "session_number": r.session_number,
                "course_title": r.course.title if r.course else "Unknown"
            }
            for r in records[:20]
        ]
    }


# ── Assessments ───────────────────────────────────────────────────────────────

assessment_router = APIRouter()


@assessment_router.get("/{assessment_id}")
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    questions = [
        {
            "id": q.id,
            "question": q.question,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,
            "order": q.order
        }
        for q in sorted(assessment.questions, key=lambda x: x.order or 0)
    ]
    return {
        "id": assessment.id,
        "title": assessment.title,
        "description": assessment.description,
        "passing_score": assessment.passing_score,
        "total_questions": assessment.total_questions,
        "course_title": assessment.course.title if assessment.course else "Unknown",
        "questions": questions
    }


@assessment_router.post("/{assessment_id}/submit")
def submit_assessment(assessment_id: int, payload: dict, db: Session = Depends(get_db)):
    trainee_id = payload.get("trainee_id")
    answers = payload.get("answers", {})  # {question_id: "A"}

    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Score calculation
    correct = 0
    detailed = []
    for q in assessment.questions:
        submitted = answers.get(str(q.id), answers.get(q.id))
        is_correct = submitted and submitted.upper() == q.correct_answer.upper()
        if is_correct:
            correct += 1
        detailed.append({
            "question_id": q.id,
            "question": q.question,
            "submitted": submitted,
            "correct_answer": q.correct_answer,
            "is_correct": is_correct,
            "explanation": q.explanation
        })

    total = len(assessment.questions)
    score = (correct / total * 100) if total > 0 else 0
    passed = score >= assessment.passing_score
    status = "passed" if passed else "failed"

    # Save attempt
    attempt = AssessmentAttempt(
        trainee_id=trainee_id,
        assessment_id=assessment_id,
        score=score,
        status=status,
        answers=json.dumps(answers),
        attempted_at=datetime.utcnow(),
        completed_at=datetime.utcnow()
    )
    db.add(attempt)

    # Update trainee skill profiles based on course skills
    skill_updates = []
    if passed and assessment.course:
        course_skills = db.query(CourseSkill).filter(
            CourseSkill.course_id == assessment.course.id
        ).all()
        for cs in course_skills:
            existing = db.query(TraineeSkill).filter(
                TraineeSkill.trainee_id == trainee_id,
                TraineeSkill.skill_id == cs.skill_id
            ).first()
            gain = cs.proficiency_gain * (score / 100)
            if existing:
                old_val = existing.proficiency
                existing.proficiency = min(100, existing.proficiency + gain)
                existing.source = "assessment"
                skill_updates.append({
                    "skill": cs.skill.name if cs.skill else "Unknown",
                    "old": round(old_val, 1),
                    "new": round(existing.proficiency, 1),
                    "gain": round(gain, 1)
                })
            else:
                new_skill = TraineeSkill(
                    trainee_id=trainee_id,
                    skill_id=cs.skill_id,
                    proficiency=gain,
                    source="assessment"
                )
                db.add(new_skill)
                skill_updates.append({
                    "skill": cs.skill.name if cs.skill else "Unknown",
                    "old": 0,
                    "new": round(gain, 1),
                    "gain": round(gain, 1)
                })

    # Notification
    notif = Notification(
        trainee_id=trainee_id,
        title=f"Assessment {'Passed ✓' if passed else 'Completed'}",
        message=f"You scored {score:.0f}% on {assessment.title}. {'Congratulations!' if passed else 'Keep practicing!'}",
        type="success" if passed else "info",
        created_at=datetime.utcnow()
    )
    db.add(notif)
    db.commit()

    return {
        "score": round(score, 1),
        "passed": passed,
        "correct_count": correct,
        "total_questions": total,
        "status": status,
        "detailed_results": detailed,
        "skill_updates": skill_updates,
        "certificate_eligible": passed,
        "passing_score": assessment.passing_score
    }


# ── Certificates ──────────────────────────────────────────────────────────────

certificate_router = APIRouter()


@certificate_router.post("/generate")
def generate_certificate(payload: dict, db: Session = Depends(get_db)):
    trainee_id = payload.get("trainee_id")
    course_id = payload.get("course_id")
    score = payload.get("score", 0)

    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    course = db.query(Course).filter(Course.id == course_id).first()

    if not trainee or not course:
        raise HTTPException(status_code=404, detail="Trainee or course not found")

    # Check if certificate already exists
    existing = db.query(Certificate).filter(
        Certificate.trainee_id == trainee_id,
        Certificate.course_id == course_id
    ).first()
    if existing:
        return {
            "certificate_id": existing.certificate_id,
            "message": "Certificate already exists",
            "already_exists": True
        }

    cert_id = f"NCCT-CC-{datetime.now().year}-{trainee.trainee_id.split('-')[-1]}-{course.id:03d}"
    hash_data = f"{cert_id}{trainee.name}{course.title}{date.today().isoformat()}"
    verification_hash = hashlib.sha256(hash_data.encode()).hexdigest()[:32]

    cert = Certificate(
        trainee_id=trainee_id,
        course_id=course_id,
        certificate_id=cert_id,
        issue_date=date.today(),
        verification_status="valid",
        verification_hash=verification_hash,
        score=score
    )
    db.add(cert)

    # Notification
    notif = Notification(
        trainee_id=trainee_id,
        title="Certificate Issued ✓",
        message=f"Your NCCT Certificate for {course.title} has been issued. ID: {cert_id}",
        type="success",
        created_at=datetime.utcnow()
    )
    db.add(notif)
    db.commit()

    return {
        "certificate_id": cert_id,
        "trainee_name": trainee.name,
        "course_title": course.title,
        "issue_date": date.today().isoformat(),
        "verification_hash": verification_hash,
        "score": score,
        "already_exists": False
    }


@certificate_router.get("/verify/{cert_id_or_hash}")
def verify_certificate(cert_id_or_hash: str, db: Session = Depends(get_db)):
    cert = db.query(Certificate).filter(
        (Certificate.certificate_id == cert_id_or_hash) |
        (Certificate.verification_hash == cert_id_or_hash)
    ).first()

    if not cert:
        return {
            "valid": False,
            "status": "NOT_FOUND",
            "message": "Certificate not found in NCCT database"
        }

    return {
        "valid": cert.verification_status == "valid",
        "certificate_id": cert.certificate_id,
        "trainee_name": cert.trainee.name if cert.trainee else "Unknown",
        "course_title": cert.course.title if cert.course else "Unknown",
        "issue_date": cert.issue_date.isoformat() if cert.issue_date else None,
        "status": cert.verification_status.upper(),
        "score": cert.score,
        "message": "Certificate is valid and verified by NCCT" if cert.verification_status == "valid" else "Certificate revoked"
    }


@certificate_router.get("/{trainee_id}/list")
def get_trainee_certificates(trainee_id: int, db: Session = Depends(get_db)):
    certs = db.query(Certificate).filter(Certificate.trainee_id == trainee_id).all()
    return [
        {
            "id": c.id,
            "certificate_id": c.certificate_id,
            "course_title": c.course.title if c.course else "Unknown",
            "issue_date": c.issue_date.isoformat() if c.issue_date else None,
            "status": c.verification_status,
            "score": c.score,
            "verification_hash": c.verification_hash
        }
        for c in certs
    ]


# ── Jobs ─────────────────────────────────────────────────────────────────────

jobs_router = APIRouter()


@jobs_router.get("/")
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.status == "active").all()
    return [
        {
            "id": j.id,
            "title": j.title,
            "employer_name": j.employer.organization_name if j.employer else "Unknown",
            "location": j.location,
            "state": j.state,
            "employment_type": j.employment_type,
            "salary_min": j.salary_min,
            "salary_max": j.salary_max,
            "education_required": j.education_required,
            "experience_years": j.experience_years,
            "required_skills": [
                {"skill_name": js.skill.name, "required_level": js.required_level}
                for js in j.required_skills if js.skill
            ],
            "applications_count": len(j.applications),
            "created_at": j.created_at.isoformat() if j.created_at else None
        }
        for j in jobs
    ]


@jobs_router.get("/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "id": job.id,
        "title": job.title,
        "description": job.description,
        "employer_name": job.employer.organization_name if job.employer else "Unknown",
        "employer_industry": job.employer.industry if job.employer else None,
        "location": job.location,
        "state": job.state,
        "employment_type": job.employment_type,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "education_required": job.education_required,
        "experience_years": job.experience_years,
        "required_skills": [
            {"skill_name": js.skill.name, "required_level": js.required_level}
            for js in job.required_skills if js.skill
        ],
        "applications_count": len(job.applications),
        "created_at": job.created_at.isoformat() if job.created_at else None
    }


@jobs_router.post("/apply")
def apply_for_job(payload: dict, db: Session = Depends(get_db)):
    trainee_id = payload.get("trainee_id")
    job_id = payload.get("job_id")
    ai_match_score = payload.get("ai_match_score")

    existing = db.query(JobApplication).filter(
        JobApplication.trainee_id == trainee_id,
        JobApplication.job_id == job_id
    ).first()
    if existing:
        return {"success": True, "message": "Already applied", "application_id": existing.id, "already_applied": True}

    application = JobApplication(
        trainee_id=trainee_id,
        job_id=job_id,
        status="applied",
        ai_match_score=ai_match_score,
        applied_at=datetime.utcnow()
    )
    db.add(application)

    job = db.query(Job).filter(Job.id == job_id).first()
    notif = Notification(
        trainee_id=trainee_id,
        title="Application Submitted ✓",
        message=f"Your application for {job.title if job else 'position'} has been submitted.",
        type="success",
        created_at=datetime.utcnow()
    )
    db.add(notif)
    db.commit()

    return {
        "success": True,
        "message": "Application submitted successfully",
        "application_id": application.id,
        "already_applied": False
    }


@jobs_router.post("/create")
def create_job(payload: dict, db: Session = Depends(get_db)):
    employer_id = payload.get("employer_id")
    required_skills = payload.pop("required_skills", [])

    job = Job(
        employer_id=employer_id,
        title=payload.get("title"),
        description=payload.get("description"),
        location=payload.get("location"),
        state=payload.get("state"),
        employment_type=payload.get("employment_type", "Full Time"),
        salary_min=payload.get("salary_min"),
        salary_max=payload.get("salary_max"),
        education_required=payload.get("education_required"),
        experience_years=payload.get("experience_years", 0),
        status="active",
        created_at=datetime.utcnow()
    )
    db.add(job)
    db.flush()

    for rs in required_skills:
        skill = db.query(Skill).filter(Skill.id == rs.get("skill_id")).first() if rs.get("skill_id") else \
                db.query(Skill).filter(Skill.name.ilike(f"%{rs.get('skill_name', '')}%")).first()
        if skill:
            js = JobSkill(job_id=job.id, skill_id=skill.id, required_level=rs.get("required_level", 70))
            db.add(js)

    db.commit()
    return {"success": True, "job_id": job.id, "message": "Job posted successfully"}
