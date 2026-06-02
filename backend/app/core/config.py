from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./university.db"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    FIRST_ADMIN_EMAIL: str = "admin@university.edu"
    FIRST_ADMIN_PASSWORD: str = "Admin@123456"
    
    class Config:
        env_file = ".env"

settings = Settings()
