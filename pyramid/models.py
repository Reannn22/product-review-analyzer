from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class SentimentEnum(str, enum.Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    review_text = Column(Text, nullable=False)
    sentiment = Column(Enum(SentimentEnum), nullable=True)
    sentiment_score = Column(Float, nullable=True)  # 0-1 confidence score
    key_points = Column(Text, nullable=True)  # JSON string or comma-separated
    created_at = Column(DateTime, default=datetime.utcnow)
    analyzed_at = Column(DateTime, nullable=True)
    
    product = relationship("Product", back_populates="reviews")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False, unique=True)
    sentiment = Column(Enum(SentimentEnum), nullable=False)
    sentiment_score = Column(Float, nullable=False)
    key_points = Column(Text, nullable=False)  # JSON string
    raw_sentiment_output = Column(Text, nullable=True)  # For debugging
    raw_gemini_output = Column(Text, nullable=True)  # For debugging
    created_at = Column(DateTime, default=datetime.utcnow)
