import json
from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    _strengths = Column("strengths", Text, default="[]")
    _weaknesses = Column("weaknesses", Text, default="[]")
    ats_compatibility = Column(String(500), default="")
    _missing_keywords = Column("missing_keywords", Text, default="[]")
    _improvement_suggestions = Column("improvement_suggestions", Text, default="[]")
    optimized_resume = Column(Text, default="")
    created_at = Column(DateTime, server_default=func.now())

    resume = relationship("Resume", back_populates="analyses")

    # JSON list getter/setter
    @property
    def strengths(self) -> list[str]:
        return json.loads(self._strengths)

    @strengths.setter
    def strengths(self, value: list[str]):
        self._strengths = json.dumps(value, ensure_ascii=False)

    @property
    def weaknesses(self) -> list[str]:
        return json.loads(self._weaknesses)

    @weaknesses.setter
    def weaknesses(self, value: list[str]):
        self._weaknesses = json.dumps(value, ensure_ascii=False)

    @property
    def missing_keywords(self) -> list[str]:
        return json.loads(self._missing_keywords)

    @missing_keywords.setter
    def missing_keywords(self, value: list[str]):
        self._missing_keywords = json.dumps(value, ensure_ascii=False)

    @property
    def improvement_suggestions(self) -> list[str]:
        return json.loads(self._improvement_suggestions)

    @improvement_suggestions.setter
    def improvement_suggestions(self, value: list[str]):
        self._improvement_suggestions = json.dumps(value, ensure_ascii=False)
