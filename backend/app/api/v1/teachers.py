from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.crud.crud_teacher import get_teacher, get_teachers, create_teacher, update_teacher, delete_teacher
from app.schemas.teacher import Teacher, TeacherCreate, TeacherUpdate, TeacherWithUser
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[TeacherWithUser])
def read_teachers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    teachers = get_teachers(db, skip=skip, limit=limit)
    result = []
    for teacher in teachers:
        result.append({
            "id": teacher.id,
            "user_id": teacher.user_id,
            "teacher_id": teacher.teacher_id,
            "specialization": teacher.specialization,
            "department_id": teacher.department_id,
            "user": {
                "id": teacher.user.id,
                "email": teacher.user.email,
                "first_name": teacher.user.first_name,
                "last_name": teacher.user.last_name,
                "role": teacher.user.role
            }
        })
    return result

@router.post("/", response_model=Teacher)
def create_teacher_endpoint(teacher: TeacherCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_teacher(db=db, teacher=teacher)

@router.get("/{teacher_id}", response_model=TeacherWithUser)
def read_teacher(teacher_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_teacher = get_teacher(db, teacher_id=teacher_id)
    if db_teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return {
        "id": db_teacher.id,
        "user_id": db_teacher.user_id,
        "teacher_id": db_teacher.teacher_id,
        "specialization": db_teacher.specialization,
        "department_id": db_teacher.department_id,
        "user": {
            "id": db_teacher.user.id,
            "email": db_teacher.user.email,
            "first_name": db_teacher.user.first_name,
            "last_name": db_teacher.user.last_name,
            "role": db_teacher.user.role
        }
    }

@router.put("/{teacher_id}", response_model=Teacher)
def update_teacher_endpoint(teacher_id: int, teacher: TeacherUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_teacher = update_teacher(db, teacher_id=teacher_id, teacher_update=teacher)
    if db_teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return db_teacher

@router.delete("/{teacher_id}")
def delete_teacher_endpoint(teacher_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_teacher = delete_teacher(db, teacher_id=teacher_id)
    if db_teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return {"message": "Teacher deleted successfully"}
