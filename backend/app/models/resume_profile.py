import json
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class ResumeProfile(Base):
    __tablename__ = "resume_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    _data = Column("profile_data", Text, default="{}")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="resume_profile")

    @property
    def data(self) -> dict:
        return json.loads(self._data) if self._data else {}

    @data.setter
    def data(self, value: dict):
        self._data = json.dumps(value, ensure_ascii=False)
