"""
Enhanced schemas with comprehensive validation
"""
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
from constants import MIN_REVIEW_LENGTH, MAX_REVIEW_LENGTH, MAX_PRODUCT_NAME_LENGTH

class ProductCreateRequest(BaseModel):
    """Schema for creating a product"""
    name: str = Field(..., min_length=2, max_length=MAX_PRODUCT_NAME_LENGTH, description="Product name")
    description: Optional[str] = Field(None, max_length=2000, description="Product description")
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Product name cannot be empty')
        return v.strip()

class ProductResponse(BaseModel):
    """Schema for product response"""
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReviewCreateRequest(BaseModel):
    """Schema for creating a review"""
    product_id: int = Field(..., description="Product ID")
    text: str = Field(..., min_length=MIN_REVIEW_LENGTH, max_length=MAX_REVIEW_LENGTH, description="Review text")
    
    @validator('text')
    def text_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Review text cannot be empty')
        return v.strip()

class SentimentAnalysis(BaseModel):
    """Schema for sentiment analysis result"""
    sentiment: str = Field(..., description="Sentiment type: positive, negative, or neutral")
    score: float = Field(..., ge=0, le=1, description="Confidence score between 0 and 1")

class AnalysisResult(BaseModel):
    """Schema for review analysis result"""
    id: int
    product_id: int
    text: str
    sentiment: str
    sentiment_score: float
    key_points: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReviewResponse(BaseModel):
    """Schema for review response"""
    id: int
    product_id: int
    text: str
    sentiment: str
    sentiment_score: float
    key_points: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    """Schema for statistics response"""
    total_reviews: int
    average_sentiment_score: float
    sentiment_distribution: dict
    
class HealthCheckResponse(BaseModel):
    """Schema for health check response"""
    status: str = "healthy"
    version: str
    timestamp: datetime

class ErrorResponse(BaseModel):
    """Schema for error response"""
    error: str
    message: str
    status_code: int
    timestamp: datetime
