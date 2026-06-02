from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.course import Course
from app.models.department import Department
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.get("/admin")
def get_admin_stats(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    total_students = db.query(Student).count()
    active_courses = db.query(Course).filter(Course.status == "active").count()
    faculty_members = db.query(Teacher).count()
    departments = db.query(Department).count()
    
    return {
        "totalStudents": total_students,
        "activeCourses": active_courses,
        "facultyMembers": faculty_members,
        "departments": departments
    }
