from pydantic import BaseModel
from typing import Optional
from datetime import date

class StudentBase(BaseModel):
    student_id: str
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class StudentCreate(StudentBase):
    user_id: int

class StudentUpdate(BaseModel):
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class Student(StudentBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class StudentWithUser(Student):
    user: dict
