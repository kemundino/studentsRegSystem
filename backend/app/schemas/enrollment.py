from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EnrollmentBase(BaseModel):
    student_id: int
    course_id: int
    status: str = "pending"
    grade: Optional[float] = None

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentUpdate(BaseModel):
    status: Optional[str] = None
    grade: Optional[float] = None

class Enrollment(EnrollmentBase):
    id: int
    enrollment_date: datetime

    class Config:
        from_attributes = True
