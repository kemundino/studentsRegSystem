from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    teacher_id = Column(String, unique=True, index=True, nullable=False)
    specialization = Column(String, nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

    # Relationships
    user = relationship("User", back_populates="teacher")
    department = relationship("Department", back_populates="teachers")
    courses = relationship("Course", back_populates="teacher")
