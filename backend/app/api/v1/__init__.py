from fastapi import APIRouter
from app.api.v1 import auth, students, teachers, courses, departments, enrollments, stats

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(enrollments.router, prefix="/enrollments", tags=["enrollments"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
