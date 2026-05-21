from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    resume_profile = relationship("ResumeProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
