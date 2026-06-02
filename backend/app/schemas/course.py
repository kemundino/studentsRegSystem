from pydantic import BaseModel
from typing import Optional

class CourseBase(BaseModel):
    code: str
    name: str
    credits: int
    description: Optional[str] = None
    teacher_id: Optional[int] = None
    department_id: Optional[int] = None
    status: str = "active"

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    credits: Optional[int] = None
    description: Optional[str] = None
    teacher_id: Optional[int] = None
    department_id: Optional[int] = None
    status: Optional[str] = None

class Course(CourseBase):
    id: int

    class Config:
        from_attributes = True
