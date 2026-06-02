from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.crud.crud_department import get_department, get_departments, create_department, update_department, delete_department
from app.schemas.department import Department, DepartmentCreate, DepartmentUpdate
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Department])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_departments(db, skip=skip, limit=limit)

@router.post("/", response_model=Department)
def create_department_endpoint(department: DepartmentCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_department(db=db, department=department)

@router.get("/{department_id}", response_model=Department)
def read_department(department_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_department = get_department(db, department_id=department_id)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

@router.put("/{department_id}", response_model=Department)
def update_department_endpoint(department_id: int, department: DepartmentUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_department = update_department(db, department_id=department_id, department_update=department)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

@router.delete("/{department_id}")
def delete_department_endpoint(department_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_department = delete_department(db, department_id=department_id)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return {"message": "Department deleted successfully"}
