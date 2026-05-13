from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_parser import extract_text_from_pdf
from app.services.ai_analyzer import analyze_resume
from app.core.schemas import AnalysisResult, ErrorResponse
from app.core.config import settings

router = APIRouter()


@router.post(
    "/upload",
    response_model=AnalysisResult,
    responses={400: {"model": ErrorResponse}, 413: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def upload_resume(file: UploadFile = File(...)):
    # Validate file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Only PDF files are accepted. Got: {ext}")

    # Read and validate file size
    file_bytes = await file.read()
    file_size_mb = len(file_bytes) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=413, detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE_MB}MB. Got: {file_size_mb:.1f}MB")

    # Extract text from PDF
    try:
        resume_text = extract_text_from_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="The PDF appears to contain no extractable text. It may be a scanned image.")

    # Analyze with AI
    try:
        result = analyze_resume(resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    return result
