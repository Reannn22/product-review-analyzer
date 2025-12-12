from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/product_review_db"
    HUGGINGFACE_API_KEY: str = ""
    HF_API_TOKEN: str = ""  # Alias for HUGGINGFACE_API_KEY
    HUGGINGFACE_API_URL: str = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"
    GEMINI_API_KEY: str = ""
    GEMINI_API_URL: str = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    DEBUG: bool = True
    BACKEND_PORT: int = 8000
    BACKEND_HOST: str = "0.0.0.0"
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Database setup
engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
