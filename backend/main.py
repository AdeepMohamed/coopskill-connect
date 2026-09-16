"""FastAPI main application entry point."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from dotenv import load_dotenv

from database import engine, Base
from routers.auth import router as auth_router
from routers.trainees import router as trainees_router
from routers.ai import router as ai_router
from routers.features import (
    attendance_router, assessment_router,
    certificate_router, jobs_router
)
from routers.secondary import (
    courses_router, employer_router,
    analytics_router, offline_router
)

load_dotenv()

# ── Create all tables ─────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── Rate limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="CoopSkill Connect API",
    description="AI & LMS-Enabled Cooperative Capacity Building, ERP & Employment Ecosystem",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── CORS ──────────────────────────────────────────────────────────────────────
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(trainees_router, prefix="/api/trainees", tags=["Trainees"])
app.include_router(courses_router, prefix="/api/courses", tags=["Courses"])
app.include_router(attendance_router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(assessment_router, prefix="/api/assessments", tags=["Assessments"])
app.include_router(certificate_router, prefix="/api/certificates", tags=["Certificates"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(employer_router, prefix="/api/employers", tags=["Employers"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI (Gemini)"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(offline_router, prefix="/api/offline", tags=["Offline/Sync"])


@app.get("/")
def root():
    return {
        "name": "CoopSkill Connect API",
        "version": "1.0.0",
        "description": "AI & LMS-Enabled Cooperative Capacity Building",
        "organization": "NCCT | Ministry of Cooperation",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": __import__("datetime").datetime.utcnow().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
