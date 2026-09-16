from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey,
    Text, Date, Enum as SAEnum, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from database import Base


class UserRole(str, enum.Enum):
    trainee = "trainee"
    trainer = "trainer"
    admin = "admin"
    employer = "employer"


class EmploymentStatus(str, enum.Enum):
    employed = "employed"
    seeking = "seeking"
    student = "student"
    self_employed = "self_employed"


class CourseLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class EnrollmentStatus(str, enum.Enum):
    enrolled = "enrolled"
    in_progress = "in_progress"
    completed = "completed"
    dropped = "dropped"


class AttendanceStatus(str, enum.Enum):
    present = "present"
    absent = "absent"
    late = "late"


class AttemptStatus(str, enum.Enum):
    passed = "passed"
    failed = "failed"
    in_progress = "in_progress"


class JobStatus(str, enum.Enum):
    active = "active"
    closed = "closed"
    draft = "draft"


class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    under_review = "under_review"
    shortlisted = "shortlisted"
    rejected = "rejected"
    hired = "hired"


class CertificateStatus(str, enum.Enum):
    valid = "valid"
    revoked = "revoked"


# ─── Users ─────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.trainee)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="user", uselist=False)
    trainer = relationship("Trainer", back_populates="user", uselist=False)
    employer = relationship("Employer", back_populates="user", uselist=False)


# ─── Institutions ──────────────────────────────────────────────────────────────

class Institution(Base):
    __tablename__ = "institutions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True)
    location = Column(String(255))
    state = Column(String(100))
    type = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

    trainees = relationship("Trainee", back_populates="institution")
    trainers = relationship("Trainer", back_populates="institution")


# ─── Trainees ──────────────────────────────────────────────────────────────────

class Trainee(Base):
    __tablename__ = "trainees"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    trainee_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(20))
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True)
    education = Column(String(100))
    location = Column(String(255))
    state = Column(String(100))
    languages = Column(String(255), default="English")
    employment_status = Column(SAEnum(EmploymentStatus), default=EmploymentStatus.seeking)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="trainee")
    institution = relationship("Institution", back_populates="trainees")
    enrollments = relationship("Enrollment", back_populates="trainee")
    attendances = relationship("Attendance", back_populates="trainee")
    attempts = relationship("AssessmentAttempt", back_populates="trainee")
    skills = relationship("TraineeSkill", back_populates="trainee")
    certificates = relationship("Certificate", back_populates="trainee")
    applications = relationship("JobApplication", back_populates="trainee")
    ai_recommendations = relationship("AIRecommendation", back_populates="trainee")
    notifications = relationship("Notification", back_populates="trainee")


# ─── Trainers ──────────────────────────────────────────────────────────────────

class Trainer(Base):
    __tablename__ = "trainers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String(255), nullable=False)
    designation = Column(String(255))
    institution_id = Column(Integer, ForeignKey("institutions.id"))
    specialization = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="trainer")
    institution = relationship("Institution", back_populates="trainers")


# ─── Employers ─────────────────────────────────────────────────────────────────

class Employer(Base):
    __tablename__ = "employers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    organization_name = Column(String(255), nullable=False)
    industry = Column(String(100))
    location = Column(String(255))
    state = Column(String(100))
    contact_person = Column(String(255))
    website = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="employer")
    jobs = relationship("Job", back_populates="employer")


# ─── Skills ────────────────────────────────────────────────────────────────────

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    category = Column(String(100))
    description = Column(Text)

    trainee_skills = relationship("TraineeSkill", back_populates="skill")
    job_skills = relationship("JobSkill", back_populates="skill")
    course_skills = relationship("CourseSkill", back_populates="skill")


class TraineeSkill(Base):
    __tablename__ = "trainee_skills"
    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    proficiency = Column(Float, default=0.0)  # 0–100
    source = Column(String(100), default="assessment")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="skills")
    skill = relationship("Skill", back_populates="trainee_skills")
    __table_args__ = (UniqueConstraint("trainee_id", "skill_id"),)


# ─── Courses ───────────────────────────────────────────────────────────────────

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    language = Column(String(100), default="English")
    duration_days = Column(Integer)
    level = Column(SAEnum(CourseLevel), default=CourseLevel.beginner)
    instructor_id = Column(Integer, ForeignKey("trainers.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    modules = relationship("CourseModule", back_populates="course", order_by="CourseModule.order")
    enrollments = relationship("Enrollment", back_populates="course")
    attendances = relationship("Attendance", back_populates="course")
    assessments = relationship("Assessment", back_populates="course")
    certificates = relationship("Certificate", back_populates="course")
    skills = relationship("CourseSkill", back_populates="course")


class CourseModule(Base):
    __tablename__ = "course_modules"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    order = Column(Integer, nullable=False)
    duration_minutes = Column(Integer)
    video_url = Column(String(500))
    content = Column(Text)

    course = relationship("Course", back_populates="modules")


class CourseSkill(Base):
    __tablename__ = "course_skills"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    proficiency_gain = Column(Float, default=10.0)

    course = relationship("Course", back_populates="skills")
    skill = relationship("Skill", back_populates="course_skills")


# ─── Enrollments ───────────────────────────────────────────────────────────────

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    progress = Column(Float, default=0.0)  # 0–100
    current_module = Column(Integer, default=1)
    status = Column(SAEnum(EnrollmentStatus), default=EnrollmentStatus.enrolled)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    trainee = relationship("Trainee", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


# ─── Attendance ────────────────────────────────────────────────────────────────

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    date = Column(Date, nullable=False)
    status = Column(SAEnum(AttendanceStatus), default=AttendanceStatus.present)
    method = Column(String(50), default="QR")
    check_in_time = Column(String(20))
    session_number = Column(Integer)

    trainee = relationship("Trainee", back_populates="attendances")
    course = relationship("Course", back_populates="attendances")


# ─── Assessments ───────────────────────────────────────────────────────────────

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    passing_score = Column(Float, default=60.0)
    total_questions = Column(Integer, default=5)

    course = relationship("Course", back_populates="assessments")
    questions = relationship("AssessmentQuestion", back_populates="assessment")
    attempts = relationship("AssessmentAttempt", back_populates="assessment")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    question = Column(Text, nullable=False)
    option_a = Column(String(500))
    option_b = Column(String(500))
    option_c = Column(String(500))
    option_d = Column(String(500))
    correct_answer = Column(String(1), nullable=False)  # A, B, C, D
    explanation = Column(Text)
    order = Column(Integer)

    assessment = relationship("Assessment", back_populates="questions")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"
    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"))
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    score = Column(Float, default=0.0)
    status = Column(SAEnum(AttemptStatus), default=AttemptStatus.in_progress)
    answers = Column(Text)  # JSON string
    attempted_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    trainee = relationship("Trainee", back_populates="attempts")
    assessment = relationship("Assessment", back_populates="attempts")


# ─── Certificates ──────────────────────────────────────────────────────────────

class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    certificate_id = Column(String(100), unique=True, nullable=False)
    issue_date = Column(Date, nullable=False)
    verification_status = Column(SAEnum(CertificateStatus), default=CertificateStatus.valid)
    verification_hash = Column(String(255), unique=True)
    score = Column(Float)

    trainee = relationship("Trainee", back_populates="certificates")
    course = relationship("Course", back_populates="certificates")


# ─── Jobs ──────────────────────────────────────────────────────────────────────

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("employers.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    location = Column(String(255))
    state = Column(String(100))
    employment_type = Column(String(100), default="Full Time")
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    education_required = Column(String(100))
    experience_years = Column(Integer, default=0)
    status = Column(SAEnum(JobStatus), default=JobStatus.active)
    created_at = Column(DateTime, default=datetime.utcnow)

    employer = relationship("Employer", back_populates="jobs")
    required_skills = relationship("JobSkill", back_populates="job")
    applications = relationship("JobApplication", back_populates="job")


class JobSkill(Base):
    __tablename__ = "job_skills"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    required_level = Column(Float, default=60.0)

    job = relationship("Job", back_populates="required_skills")
    skill = relationship("Skill", back_populates="job_skills")


class JobApplication(Base):
    __tablename__ = "job_applications"
    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    status = Column(SAEnum(ApplicationStatus), default=ApplicationStatus.applied)
    ai_match_score = Column(Float)
    applied_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text)

    trainee = relationship("Trainee", back_populates="applications")
    job = relationship("Job", back_populates="applications")


# ─── AI Recommendations ────────────────────────────────────────────────────────

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"
    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"))
    recommendation_type = Column(String(100))  # career, course, job_match, skill_gap
    input_snapshot = Column(Text)  # JSON
    response = Column(Text)  # JSON Gemini response
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="ai_recommendations")


# ─── Notifications ─────────────────────────────────────────────────────────────

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"))
    title = Column(String(255), nullable=False)
    message = Column(Text)
    type = Column(String(50))  # success, info, warning
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="notifications")
