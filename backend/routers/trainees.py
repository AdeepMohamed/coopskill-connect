"""Trainee router - profile, dashboard, skills."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import (Trainee, TraineeSkill, Skill, Enrollment, Attendance,
                    Certificate, AssessmentAttempt, AIRecommendation,
                    Notification, Course, Job, JobApplication)
from schemas import TraineeDashboard, TraineeProfile, SkillOut
import json

router = APIRouter()


def get_trainee_or_404(trainee_id: int, db: Session) -> Trainee:
    t = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Trainee not found")
    return t


@router.get("/{trainee_id}/dashboard")
def get_trainee_dashboard(trainee_id: int, db: Session = Depends(get_db)):
    trainee = get_trainee_or_404(trainee_id, db)

    # Learning progress (average of active enrollments)
    enrollments = db.query(Enrollment).filter(
        Enrollment.trainee_id == trainee_id,
        Enrollment.status.in_(["in_progress", "enrolled"])
    ).all()
    current_enrollment = enrollments[0] if enrollments else None
    learning_progress = current_enrollment.progress if current_enrollment else 0.0

    # Attendance rate
    all_attendance = db.query(Attendance).filter(Attendance.trainee_id == trainee_id).all()
    present_count = sum(1 for a in all_attendance if a.status == "present")
    attendance_rate = (present_count / len(all_attendance) * 100) if all_attendance else 0.0

    # Skills
    trainee_skills = db.query(TraineeSkill).filter(TraineeSkill.trainee_id == trainee_id).all()

    # Certificates
    certificates = db.query(Certificate).filter(Certificate.trainee_id == trainee_id).all()

    # Job matches (applications with AI scores)
    job_matches = db.query(JobApplication).filter(
        JobApplication.trainee_id == trainee_id
    ).count()

    # Latest AI recommendation
    latest_ai = db.query(AIRecommendation).filter(
        AIRecommendation.trainee_id == trainee_id,
        AIRecommendation.recommendation_type == "career"
    ).order_by(AIRecommendation.created_at.desc()).first()

    latest_ai_dict = None
    if latest_ai:
        try:
            latest_ai_dict = {
                "response": json.loads(latest_ai.response),
                "created_at": latest_ai.created_at.isoformat()
            }
        except Exception:
            latest_ai_dict = {"response": {}, "created_at": latest_ai.created_at.isoformat() if latest_ai else None}

    # Notifications
    notifications = db.query(Notification).filter(
        Notification.trainee_id == trainee_id
    ).order_by(Notification.created_at.desc()).limit(5).all()

    # Current course info
    current_course_dict = None
    if current_enrollment:
        course = db.query(Course).filter(Course.id == current_enrollment.course_id).first()
        if course:
            current_course_dict = {
                "id": course.id,
                "title": course.title,
                "code": course.code,
                "progress": current_enrollment.progress,
                "current_module": current_enrollment.current_module,
                "modules_count": len(course.modules),
                "status": current_enrollment.status,
            }

    # Recent certificates
    recent_certs = [
        {
            "certificate_id": c.certificate_id,
            "course_title": db.query(Course).filter(Course.id == c.course_id).first().title
            if db.query(Course).filter(Course.id == c.course_id).first() else "Unknown",
            "issue_date": c.issue_date.isoformat() if c.issue_date else None,
        }
        for c in sorted(certificates, key=lambda x: x.issue_date, reverse=True)[:3]
    ]

    institution = trainee.institution
    return {
        "trainee": {
            "id": trainee.id,
            "trainee_id": trainee.trainee_id,
            "name": trainee.name,
            "email": trainee.user.email if trainee.user else None,
            "phone": trainee.phone,
            "institution_name": institution.name if institution else None,
            "education": trainee.education,
            "location": trainee.location,
            "state": trainee.state,
            "languages": trainee.languages,
            "employment_status": trainee.employment_status,
            "created_at": trainee.created_at.isoformat() if trainee.created_at else None,
        },
        "learning_progress": round(learning_progress, 1),
        "attendance_rate": round(attendance_rate, 1),
        "skills_count": len(trainee_skills),
        "certificates_count": len(certificates),
        "job_matches_count": job_matches,
        "current_course": current_course_dict,
        "latest_ai_recommendation": latest_ai_dict,
        "recent_certificates": recent_certs,
        "skills": [
            {
                "skill_id": ts.skill_id,
                "name": ts.skill.name if ts.skill else "Unknown",
                "category": ts.skill.category if ts.skill else None,
                "proficiency": ts.proficiency,
                "source": ts.source,
                "updated_at": ts.updated_at.isoformat() if ts.updated_at else None,
            }
            for ts in trainee_skills
        ],
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat() if n.created_at else None,
            }
            for n in notifications
        ]
    }


@router.get("/{trainee_id}/profile")
def get_trainee_profile(trainee_id: int, db: Session = Depends(get_db)):
    trainee = get_trainee_or_404(trainee_id, db)
    skills = db.query(TraineeSkill).filter(TraineeSkill.trainee_id == trainee_id).all()
    enrollments = db.query(Enrollment).filter(Enrollment.trainee_id == trainee_id).all()
    certificates = db.query(Certificate).filter(Certificate.trainee_id == trainee_id).all()

    return {
        "trainee": {
            "id": trainee.id,
            "trainee_id": trainee.trainee_id,
            "name": trainee.name,
            "email": trainee.user.email if trainee.user else None,
            "phone": trainee.phone,
            "institution_name": trainee.institution.name if trainee.institution else None,
            "education": trainee.education,
            "location": trainee.location,
            "state": trainee.state,
            "languages": trainee.languages,
            "employment_status": trainee.employment_status,
        },
        "skills": [
            {
                "skill_id": ts.skill_id,
                "name": ts.skill.name,
                "category": ts.skill.category,
                "proficiency": ts.proficiency,
            }
            for ts in skills
        ],
        "enrollments": [
            {
                "course_title": e.course.title if e.course else "Unknown",
                "progress": e.progress,
                "status": e.status,
            }
            for e in enrollments
        ],
        "certificates_count": len(certificates),
    }


@router.get("/{trainee_id}/skills")
def get_trainee_skills(trainee_id: int, db: Session = Depends(get_db)):
    get_trainee_or_404(trainee_id, db)
    skills = db.query(TraineeSkill).filter(TraineeSkill.trainee_id == trainee_id).all()
    return [
        {
            "skill_id": ts.skill_id,
            "name": ts.skill.name,
            "category": ts.skill.category,
            "proficiency": ts.proficiency,
            "source": ts.source,
        }
        for ts in skills
    ]
