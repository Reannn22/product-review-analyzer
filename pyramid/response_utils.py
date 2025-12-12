"""
API response utilities for consistent response formatting
"""
from datetime import datetime
from typing import Any, Optional, List
from pydantic import BaseModel

class APIResponse(BaseModel):
    """Standard API response wrapper"""
    success: bool
    message: str
    data: Optional[Any] = None
    errors: Optional[List[str]] = None
    timestamp: datetime

class PaginatedResponse(BaseModel):
    """Paginated response wrapper"""
    success: bool
    data: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int
    timestamp: datetime

def success_response(
    message: str,
    data: Optional[Any] = None,
    status_code: int = 200
) -> dict:
    """Create a success response"""
    return {
        "success": True,
        "message": message,
        "data": data,
        "timestamp": datetime.utcnow().isoformat()
    }

def error_response(
    message: str,
    errors: Optional[List[str]] = None,
    status_code: int = 400
) -> dict:
    """Create an error response"""
    return {
        "success": False,
        "message": message,
        "errors": errors or [],
        "timestamp": datetime.utcnow().isoformat()
    }

def paginated_response(
    data: List[Any],
    total: int,
    page: int = 1,
    page_size: int = 10
) -> dict:
    """Create a paginated response"""
    total_pages = (total + page_size - 1) // page_size
    return {
        "success": True,
        "data": data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "timestamp": datetime.utcnow().isoformat()
    }
