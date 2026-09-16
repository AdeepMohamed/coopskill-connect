"""Pydantic schemas for all API request/response models."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime, date
from enum import Enum


# ─── Auth Schemas ──────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class DemoLoginRequest(BaseModel):
    role: str  # trainee | trainer | admin | employer


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    name: str
    redirect_to: str


# ─── Trainee Schemas ───────────────────────────────────────────────────────────

class TraineeProfile(BaseModel):
    id: int
    trainee_id: str
    name: str
    email: Optional[str]
    phone: Optional[str]
    institution_name: Optional[str]
    education: Optional[str]
    location: Optional[str]
    state: Optional[str]
    languages: Optional[str]
    employment_status: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class SkillOut(BaseModel):
    skill_id: int
    name: str
    category: Optional[str]
    proficiency: float
    source: Optional[str]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class TraineeDashboard(BaseModel):
    trainee: TraineeProfile
    learning_progress: float
    attendance_rate: float
    skills_count: int
    certificates_count: int
    job_matches_count: int
    current_course: Optional[dict]
    latest_ai_recommendation: Optional[dict]
    recent_certificates: List[dict]
    skills: List[SkillOut]
    notifications: List[dict]


# ─── Course Schemas ────────────────────────────────────────────────────────────

class CourseOut(BaseModel):
    id: int
    code: Optional[str]
    title: str
    description: Optional[str]
    category: Optional[str]
    language: Optional[str]
    duration_days: Optional[int]
    level: Optional[str]
    modules_count: int = 0

    class Config:
        from_attributes = True


class ModuleOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    order: int
    duration_minutes: Optional[int]
    content: Optional[str]

    class Config:
        from_attributes = True


class EnrollmentOut(BaseModel):
    id: int
    course_id: int
    course_title: str
    progress: float
    current_module: int
    status: str
    enrolled_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class EnrollRequest(BaseModel):
    course_id: int


class ProgressUpdateRequest(BaseModel):
    module_id: int
    progress: float
    current_module: int


# ─── Attendance Schemas ────────────────────────────────────────────────────────

class AttendanceRecord(BaseModel):
    id: int
    course_title: str
    date: date
    status: str
    method: str
    check_in_time: Optional[str]
    session_number: Optional[int]

    class Config:
        from_attributes = True


class QRScanRequest(BaseModel):
    course_id: int
    qr_code: Optional[str] = None


class AttendanceSummary(BaseModel):
    total_sessions: int
    present: int
    absent: int
    attendance_rate: float
    recent_records: List[AttendanceRecord]


# ─── Assessment Schemas ────────────────────────────────────────────────────────

class QuestionOut(BaseModel):
    id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    order: Optional[int]

    class Config:
        from_attributes = True


class AssessmentOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    passing_score: float
    total_questions: int
    questions: List[QuestionOut]

    class Config:
        from_attributes = True


class SubmitAnswers(BaseModel):
    answers: dict  # {question_id: "A/B/C/D"}


class AssessmentResult(BaseModel):
    score: float
    passed: bool
    correct_count: int
    total_questions: int
    detailed_results: List[dict]
    skill_updates: List[dict]
    certificate_eligible: bool


# ─── Certificate Schemas ───────────────────────────────────────────────────────

class CertificateOut(BaseModel):
    id: int
    certificate_id: str
    trainee_name: str
    course_title: str
    issue_date: date
    verification_status: str
    score: Optional[float]
    verification_hash: str

    class Config:
        from_attributes = True


class VerifyResponse(BaseModel):
    valid: bool
    certificate_id: str
    trainee_name: Optional[str]
    course_title: Optional[str]
    issue_date: Optional[date]
    status: str
    message: str


# ─── Job Schemas ───────────────────────────────────────────────────────────────

class JobOut(BaseModel):
    id: int
    title: str
    employer_name: str
    location: str
    state: Optional[str]
    employment_type: str
    salary_min: Optional[int]
    salary_max: Optional[int]
    education_required: Optional[str]
    experience_years: Optional[int]
    status: str
    required_skills: List[dict]
    applications_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class JobWithMatch(JobOut):
    ai_match_score: Optional[float] = None
    matching_skills: List[str] = []


class PostJobRequest(BaseModel):
    title: str
    description: str
    location: str
    state: Optional[str]
    employment_type: str = "Full Time"
    salary_min: Optional[int]
    salary_max: Optional[int]
    education_required: Optional[str]
    experience_years: int = 0
    required_skill_ids: List[dict]  # [{skill_id, required_level}]


class ApplyRequest(BaseModel):
    job_id: int


# ─── AI Schemas ───────────────────────────────────────────────────────────────

class CareerRecommendationRequest(BaseModel):
    trainee_id: int
    force_refresh: bool = False


class SkillGapRequest(BaseModel):
    trainee_id: int
    job_id: int


class CourseRecommendationRequest(BaseModel):
    trainee_id: int


class JobMatchRequest(BaseModel):
    trainee_id: int
    job_id: int


class ChatMessage(BaseModel):
    role: str  # user | assistant
    content: str


class ChatRequest(BaseModel):
    trainee_id: int
    messages: List[ChatMessage]


class CareerRecommendationResponse(BaseModel):
    recommendation: str
    career_paths: List[dict]
    matching_skills: List[str]
    skill_gaps: List[str]
    recommended_courses: List[str]
    next_steps: List[str]
    reasoning: str
    generated_at: datetime
    is_fallback: bool = False


# ─── Analytics Schemas ─────────────────────────────────────────────────────────

class AdminMetrics(BaseModel):
    total_trainees: int
    active_programmes: int
    institutions: int
    certificates_issued: int
    employment_connections: int
    monthly_registrations: List[dict]
    course_completion_by_category: List[dict]
    assessment_performance: List[dict]
    employment_trend: List[dict]
    skill_demand_intelligence: Optional[dict]


# ─── Offline/Sync Schemas ──────────────────────────────────────────────────────

class SyncRequest(BaseModel):
    trainee_id: int
    offline_attendance: List[dict] = []
    offline_progress: List[dict] = []
    offline_assessments: List[dict] = []


class SyncResponse(BaseModel):
    success: bool
    synced_attendance: int
    synced_progress: int
    synced_assessments: int
    message: str
