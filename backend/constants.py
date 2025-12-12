# API Constants and Configuration
from enum import Enum

class SentimentType(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class ErrorMessages(Enum):
    INVALID_REVIEW_TEXT = "Review text is required and must be at least 10 characters"
    PRODUCT_NOT_FOUND = "Product not found"
    REVIEW_NOT_FOUND = "Review not found"
    ANALYSIS_FAILED = "Failed to analyze review"
    DATABASE_ERROR = "Database error occurred"
    INVALID_REQUEST = "Invalid request parameters"
    UNAUTHORIZED = "Unauthorized access"
    SERVER_ERROR = "Internal server error"

class SuccessMessages(Enum):
    REVIEW_CREATED = "Review analyzed successfully"
    PRODUCT_CREATED = "Product created successfully"
    DATA_RETRIEVED = "Data retrieved successfully"

# Review validation constants
MIN_REVIEW_LENGTH = 10
MAX_REVIEW_LENGTH = 1000
MAX_PRODUCT_NAME_LENGTH = 255
MAX_DESCRIPTION_LENGTH = 2000

# API Response codes
RESPONSE_CODES = {
    "SUCCESS": 200,
    "CREATED": 201,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "NOT_FOUND": 404,
    "CONFLICT": 409,
    "UNPROCESSABLE": 422,
    "SERVER_ERROR": 500,
    "SERVICE_UNAVAILABLE": 503,
}
