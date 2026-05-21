from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_user
from app.models.resume_profile import ResumeProfile


class ProfileBody(BaseModel):
    data: dict = Field(default_factory=dict)


router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("")
def get_profile(authorization: str = Header(None), db: Session = Depends(get_db)):
    user_id = require_user(authorization)
    profile = db.query(ResumeProfile).filter(ResumeProfile.user_id == user_id).first()
    return {"data": profile.data if profile else {}}


@router.put("")
def save_profile(body: ProfileBody, authorization: str = Header(None), db: Session = Depends(get_db)):
    user_id = require_user(authorization)
    profile_data = body.data or {}
    profile = db.query(ResumeProfile).filter(ResumeProfile.user_id == user_id).first()
    if not profile:
        profile = ResumeProfile(user_id=user_id, data=profile_data)
        db.add(profile)
    else:
        profile.data = profile_data
    db.commit()
    return {"ok": True}
