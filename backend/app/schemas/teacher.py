from pydantic import BaseModel
from typing import Optional

class TeacherBase(BaseModel):
    teacher_id: str
    specialization: Optional[str] = None
    department_id: Optional[int] = None

class TeacherCreate(TeacherBase):
    user_id: int

class TeacherUpdate(BaseModel):
    specialization: Optional[str] = None
    department_id: Optional[int] = None

class Teacher(TeacherBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class TeacherWithUser(Teacher):
    user: dict
