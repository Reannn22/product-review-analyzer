from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime
from enum import Enum

class SentimentEnum(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

# Product Schemas
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Review Request/Response Schemas
class ReviewAnalyzeRequest(BaseModel):
    product_id: int
    review_text: str = Field(..., min_length=10, max_length=5000)

class ReviewAnalysisResult(BaseModel):
    sentiment: SentimentEnum
    sentiment_score: float = Field(..., ge=0, le=1)
    key_points: List[str]

class ReviewResponse(BaseModel):
    id: int
    product_id: int
    review_text: str
    sentiment: Optional[SentimentEnum]
    sentiment_score: Optional[float]
    key_points: Optional[List[str]]
    created_at: datetime
    analyzed_at: Optional[datetime]
    
    @field_validator('key_points', mode='before')
    @classmethod
    def parse_key_points(cls, v):
        """Convert key_points from string to list"""
        if v is None:
            return []
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            if not v:
                return []
            # Try JSON first
            try:
                import json
                return json.loads(v)
            except:
                # Fallback to comma-separated
                return [p.strip() for p in v.split(",") if p.strip()]
        return v
    
    class Config:
        from_attributes = True

class ReviewWithProductResponse(ReviewResponse):
    product: ProductResponse

# Analysis Schemas
class AnalysisResponse(BaseModel):
    review_id: int
    sentiment: SentimentEnum
    sentiment_score: float
    key_points: List[str]
    created_at: datetime
    
    @field_validator('key_points', mode='before')
    @classmethod
    def parse_key_points(cls, v):
        """Convert key_points from string to list"""
        if v is None:
            return []
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            if not v:
                return []
            try:
                import json
                return json.loads(v)
            except:
                return [p.strip() for p in v.split(",") if p.strip()]
        return v
    
    class Config:
        from_attributes = True

# Error Schemas
class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    status_code: int
