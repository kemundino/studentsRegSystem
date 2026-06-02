from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.crud.crud_course import get_course, get_courses, create_course, update_course, delete_course
from app.schemas.course import Course, CourseCreate, CourseUpdate
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Course])
def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_courses(db, skip=skip, limit=limit)

@router.post("/", response_model=Course)
def create_course_endpoint(course: CourseCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_course(db=db, course=course)

@router.get("/{course_id}", response_model=Course)
def read_course(course_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_course = get_course(db, course_id=course_id)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

@router.put("/{course_id}", response_model=Course)
def update_course_endpoint(course_id: int, course: CourseUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_course = update_course(db, course_id=course_id, course_update=course)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

@router.delete("/{course_id}")
def delete_course_endpoint(course_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_course = delete_course(db, course_id=course_id)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}
