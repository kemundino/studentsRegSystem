from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router
from app.core.database import engine, Base, SessionLocal
from app.core.config import settings
from app.crud.crud_user import get_user_by_email, create_user
from app.schemas.user import UserCreate
from app.models.user import UserRole
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed initial admin user if it does not exist
db = SessionLocal()
try:
    admin_user = get_user_by_email(db, email=settings.FIRST_ADMIN_EMAIL)
    if not admin_user:
        logger.info(f"Seeding default admin user: {settings.FIRST_ADMIN_EMAIL}")
        create_user(
            db=db,
            user=UserCreate(
                email=settings.FIRST_ADMIN_EMAIL,
                password=settings.FIRST_ADMIN_PASSWORD,
                first_name="System",
                last_name="Admin",
                role=UserRole.ADMIN
            )
        )
except Exception as e:
    logger.error(f"Error seeding admin user: {e}")
finally:
    db.close()

app = FastAPI(title="University Management System API")

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "University Management System API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

