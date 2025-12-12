"""
Utility functions for request validation and sanitization
"""
import re
from typing import Optional
from constants import MIN_REVIEW_LENGTH, MAX_REVIEW_LENGTH, MAX_PRODUCT_NAME_LENGTH, MAX_DESCRIPTION_LENGTH
from exceptions import ValidationException

def sanitize_text(text: str) -> str:
    """Sanitize input text by removing extra whitespace and special characters"""
    if not isinstance(text, str):
        raise ValidationException("Input must be text")
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Remove potentially harmful characters but keep normal punctuation
    text = re.sub(r'[<>\"\'`]', '', text)
    
    return text

def validate_review_text(text: str) -> str:
    """Validate and sanitize review text"""
    if not text or not isinstance(text, str):
        raise ValidationException("Review text is required")
    
    sanitized = sanitize_text(text)
    
    if len(sanitized) < MIN_REVIEW_LENGTH:
        raise ValidationException(f"Review must be at least {MIN_REVIEW_LENGTH} characters long")
    
    if len(sanitized) > MAX_REVIEW_LENGTH:
        raise ValidationException(f"Review cannot exceed {MAX_REVIEW_LENGTH} characters")
    
    return sanitized

def validate_product_name(name: str) -> str:
    """Validate and sanitize product name"""
    if not name or not isinstance(name, str):
        raise ValidationException("Product name is required")
    
    sanitized = sanitize_text(name)
    
    if len(sanitized) > MAX_PRODUCT_NAME_LENGTH:
        raise ValidationException(f"Product name cannot exceed {MAX_PRODUCT_NAME_LENGTH} characters")
    
    if len(sanitized) < 2:
        raise ValidationException("Product name must be at least 2 characters long")
    
    return sanitized

def validate_product_description(description: Optional[str]) -> Optional[str]:
    """Validate and sanitize product description"""
    if not description:
        return None
    
    if not isinstance(description, str):
        raise ValidationException("Description must be text")
    
    sanitized = sanitize_text(description)
    
    if len(sanitized) > MAX_DESCRIPTION_LENGTH:
        raise ValidationException(f"Description cannot exceed {MAX_DESCRIPTION_LENGTH} characters")
    
    return sanitized if sanitized else None

def validate_sentiment_score(score: float) -> float:
    """Validate sentiment score is between 0 and 1"""
    if not isinstance(score, (int, float)):
        raise ValidationException("Sentiment score must be a number")
    
    if score < 0 or score > 1:
        raise ValidationException("Sentiment score must be between 0 and 1")
    
    return float(score)
