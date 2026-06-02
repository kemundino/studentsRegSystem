from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.crud.crud_student import get_student, get_students, create_student, update_student, delete_student
from app.schemas.student import Student, StudentCreate, StudentUpdate, StudentWithUser
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[StudentWithUser])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    students = get_students(db, skip=skip, limit=limit)
    result = []
    for student in students:
        result.append({
            "id": student.id,
            "user_id": student.user_id,
            "student_id": student.student_id,
            "date_of_birth": student.date_of_birth,
            "phone": student.phone,
            "address": student.address,
            "user": {
                "id": student.user.id,
                "email": student.user.email,
                "first_name": student.user.first_name,
                "last_name": student.user.last_name,
                "role": student.user.role
            }
        })
    return result

@router.post("/", response_model=Student)
def create_student_endpoint(student: StudentCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_student(db=db, student=student)

@router.get("/{student_id}", response_model=StudentWithUser)
def read_student(student_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_student = get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return {
        "id": db_student.id,
        "user_id": db_student.user_id,
        "student_id": db_student.student_id,
        "date_of_birth": db_student.date_of_birth,
        "phone": db_student.phone,
        "address": db_student.address,
        "user": {
            "id": db_student.user.id,
            "email": db_student.user.email,
            "first_name": db_student.user.first_name,
            "last_name": db_student.user.last_name,
            "role": db_student.user.role
        }
    }

@router.put("/{student_id}", response_model=Student)
def update_student_endpoint(student_id: int, student: StudentUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_student = update_student(db, student_id=student_id, student_update=student)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@router.delete("/{student_id}")
def delete_student_endpoint(student_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_student = delete_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}
