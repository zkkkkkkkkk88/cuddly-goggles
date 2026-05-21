from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes.upload import router as upload_router
from app.routes.auth import router as auth_router
from app.routes.history import router as history_router
from app.routes.profile import router as profile_router

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Upload a PDF resume and get AI-powered analysis, scoring, and optimization suggestions.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(profile_router, prefix="/api")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
