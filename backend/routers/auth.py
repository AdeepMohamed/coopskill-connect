"""Authentication router - demo login for all 4 roles."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
import os

from database import get_db
from models import User, Trainee, Trainer, Employer, Institution
from schemas import DemoLoginRequest, TokenResponse

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "coopskill-dev-secret-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

DEMO_ACCOUNTS = {
    "trainee": {
        "email": "ravi.kumar@demo.coopskill",
        "name": "Ravi Kumar",
        "role": "trainee",
        "redirect_to": "/dashboard/trainee"
    },
    "trainer": {
        "email": "arun.sharma@demo.coopskill",
        "name": "Dr. Arun Sharma",
        "role": "trainer",
        "redirect_to": "/dashboard/trainer"
    },
    "admin": {
        "email": "priya.nair@ncct.gov.in",
        "name": "Priya Nair",
        "role": "admin",
        "redirect_to": "/dashboard/admin"
    },
    "employer": {
        "email": "hr@abccoop.org",
        "name": "ABC Cooperative Federation",
        "role": "employer",
        "redirect_to": "/dashboard/employer"
    }
}


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/demo-login", response_model=TokenResponse)
def demo_login(request: DemoLoginRequest, db: Session = Depends(get_db)):
    """Demo login for prototype — returns token with role-based routing."""
    role = request.role.lower()
    if role not in DEMO_ACCOUNTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid demo role. Must be one of: {list(DEMO_ACCOUNTS.keys())}"
        )

    account = DEMO_ACCOUNTS[role]
    user = db.query(User).filter(User.email == account["email"]).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demo account not found. Please run: python seed.py"
        )

    token_data = {
        "sub": account["email"],
        "role": role,
        "user_id": user.id,
        "name": account["name"]
    }
    token = create_access_token(token_data)

    return TokenResponse(
        access_token=token,
        role=role,
        user_id=user.id,
        name=account["name"],
        redirect_to=account["redirect_to"]
    )


@router.get("/me")
def get_current_user_info(token: str, db: Session = Depends(get_db)):
    """Decode token and return current user info."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "email": payload.get("sub"),
            "role": payload.get("role"),
            "user_id": payload.get("user_id"),
            "name": payload.get("name")
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
