from pydantic import BaseModel, Field


class AnalysisResult(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Resume score (0-100)")
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    ats_compatibility: str = Field(default="")
    missing_keywords: list[str] = Field(default_factory=list)
    improvement_suggestions: list[str] = Field(default_factory=list)
    optimized_resume: str = Field(default="")


class ErrorResponse(BaseModel):
    detail: str
    error_code: str | None = None
