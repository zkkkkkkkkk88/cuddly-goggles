from fastapi import APIRouter, UploadFile, File, Header, HTTPException, Depends, Request
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.schemas import AnalysisResult, ErrorResponse
from app.core.security import require_user
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.services.pdf_parser import extract_text_from_pdf
from app.services.ai_analyzer import analyze_resume

router = APIRouter()


@router.post(
    "/upload",
    response_model=AnalysisResult,
    responses={400: {"model": ErrorResponse}, 401: {"model": ErrorResponse}, 413: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def upload_resume(
    file: UploadFile = File(...),
    authorization: str = Header(None),
    db: Session = Depends(get_db),
):
    user_id = require_user(authorization)

    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="未提供文件")
    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"仅接受 PDF 文件，收到: {ext}")

    # Read + size check
    file_bytes = await file.read()
    file_size_mb = len(file_bytes) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=413, detail=f"文件过大。最大 {settings.MAX_FILE_SIZE_MB}MB，收到 {file_size_mb:.1f}MB")

    # Extract text
    try:
        resume_text = extract_text_from_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF 解析失败: {str(e)}")
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="该 PDF 不含可提取的文字，可能为扫描件")

    # AI analysis
    try:
        result = analyze_resume(resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 分析失败: {str(e)}")

    # Save to database
    resume = Resume(user_id=user_id, filename=file.filename, raw_text=resume_text, file_size=len(file_bytes))
    db.add(resume)
    db.flush()

    analysis = Analysis(
        resume_id=resume.id,
        score=result.score,
        strengths=result.strengths,
        weaknesses=result.weaknesses,
        ats_compatibility=result.ats_compatibility,
        missing_keywords=result.missing_keywords,
        improvement_suggestions=result.improvement_suggestions,
        optimized_resume=result.optimized_resume,
    )
    db.add(analysis)
    db.commit()

    return result
