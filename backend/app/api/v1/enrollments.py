from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.crud.crud_enrollment import get_enrollment, get_enrollments, create_enrollment, update_enrollment, approve_enrollment, delete_enrollment
from app.schemas.enrollment import Enrollment, EnrollmentCreate, EnrollmentUpdate
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Enrollment])
def read_enrollments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_enrollments(db, skip=skip, limit=limit)

@router.post("/", response_model=Enrollment)
def create_enrollment_endpoint(enrollment: EnrollmentCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_enrollment(db=db, enrollment=enrollment)

@router.get("/{enrollment_id}", response_model=Enrollment)
def read_enrollment(enrollment_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_enrollment = get_enrollment(db, enrollment_id=enrollment_id)
    if db_enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return db_enrollment

@router.put("/{enrollment_id}", response_model=Enrollment)
def update_enrollment_endpoint(enrollment_id: int, enrollment: EnrollmentUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_enrollment = update_enrollment(db, enrollment_id=enrollment_id, enrollment_update=enrollment)
    if db_enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return db_enrollment

@router.put("/{enrollment_id}/approve", response_model=Enrollment)
def approve_enrollment_endpoint(enrollment_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_enrollment = approve_enrollment(db, enrollment_id=enrollment_id)
    if db_enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return db_enrollment

@router.delete("/{enrollment_id}")
def delete_enrollment_endpoint(enrollment_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_enrollment = delete_enrollment(db, enrollment_id=enrollment_id)
    if db_enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"message": "Enrollment deleted successfully"}
