from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    credits = Column(Integer, nullable=False)
    description = Column(String, nullable=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    status = Column(String, default="active")

    # Relationships
    teacher = relationship("Teacher", back_populates="courses")
    department = relationship("Department", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
