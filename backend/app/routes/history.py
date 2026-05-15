from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_user
from app.models.resume import Resume
from app.models.analysis import Analysis

router = APIRouter(prefix="/history", tags=["history"])


@router.get("")
def list_history(
    authorization: str = Header(None),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
):
    user_id = require_user(authorization)
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "file_size": r.file_size,
            "created_at": r.created_at.isoformat(),
            "analysis_count": len(r.analyses),
        }
        for r in resumes
    ]


@router.get("/{resume_id}")
def get_history(resume_id: int, authorization: str = Header(None), db: Session = Depends(get_db)):
    user_id = require_user(authorization)
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="记录不存在")

    analysis = resume.analyses[0] if resume.analyses else None
    return {
        "id": resume.id,
        "filename": resume.filename,
        "file_size": resume.file_size,
        "raw_text": resume.raw_text,
        "created_at": resume.created_at.isoformat(),
        "analysis": (
            {
                "id": analysis.id,
                "score": analysis.score,
                "strengths": analysis.strengths,
                "weaknesses": analysis.weaknesses,
                "ats_compatibility": analysis.ats_compatibility,
                "missing_keywords": analysis.missing_keywords,
                "improvement_suggestions": analysis.improvement_suggestions,
                "optimized_resume": analysis.optimized_resume,
                "created_at": analysis.created_at.isoformat(),
            }
            if analysis
            else None
        ),
    }


@router.delete("/{resume_id}")
def delete_history(resume_id: int, authorization: str = Header(None), db: Session = Depends(get_db)):
    user_id = require_user(authorization)
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="记录不存在")
    db.delete(resume)
    db.commit()
    return {"ok": True}
