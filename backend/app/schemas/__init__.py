from app.schemas.user import User, UserCreate, UserUpdate, Token, TokenData
from app.schemas.student import Student, StudentCreate, StudentUpdate, StudentWithUser
from app.schemas.teacher import Teacher, TeacherCreate, TeacherUpdate, TeacherWithUser
from app.schemas.department import Department, DepartmentCreate, DepartmentUpdate
from app.schemas.course import Course, CourseCreate, CourseUpdate
from app.schemas.enrollment import Enrollment, EnrollmentCreate, EnrollmentUpdate

__all__ = [
    "User", "UserCreate", "UserUpdate", "Token", "TokenData",
    "Student", "StudentCreate", "StudentUpdate", "StudentWithUser",
    "Teacher", "TeacherCreate", "TeacherUpdate", "TeacherWithUser",
    "Department", "DepartmentCreate", "DepartmentUpdate",
    "Course", "CourseCreate", "CourseUpdate",
    "Enrollment", "EnrollmentCreate", "EnrollmentUpdate"
]
