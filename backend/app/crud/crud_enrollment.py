from sqlalchemy.orm import Session
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate, EnrollmentUpdate

def get_enrollment(db: Session, enrollment_id: int):
    return db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()

def get_enrollments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Enrollment).offset(skip).limit(limit).all()

def create_enrollment(db: Session, enrollment: EnrollmentCreate):
    db_enrollment = Enrollment(**enrollment.model_dump())
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

def update_enrollment(db: Session, enrollment_id: int, enrollment_update: EnrollmentUpdate):
    db_enrollment = get_enrollment(db, enrollment_id)
    if db_enrollment:
        for field, value in enrollment_update.model_dump(exclude_unset=True).items():
            setattr(db_enrollment, field, value)
        db.commit()
        db.refresh(db_enrollment)
    return db_enrollment

def approve_enrollment(db: Session, enrollment_id: int):
    db_enrollment = get_enrollment(db, enrollment_id)
    if db_enrollment:
        db_enrollment.status = "approved"
        db.commit()
        db.refresh(db_enrollment)
    return db_enrollment

def delete_enrollment(db: Session, enrollment_id: int):
    db_enrollment = get_enrollment(db, enrollment_id)
    if db_enrollment:
        db.delete(db_enrollment)
        db.commit()
    return db_enrollment
