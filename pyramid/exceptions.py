"""
Custom exceptions for the Product Review Analyzer API
"""

class APIException(Exception):
    """Base exception for API errors"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class ValidationException(APIException):
    """Raised when request validation fails"""
    def __init__(self, message: str):
        super().__init__(message, 400)

class ProductNotFoundException(APIException):
    """Raised when product is not found"""
    def __init__(self, product_id: int = None):
        message = f"Product with ID {product_id} not found" if product_id else "Product not found"
        super().__init__(message, 404)

class ReviewNotFoundException(APIException):
    """Raised when review is not found"""
    def __init__(self, review_id: int = None):
        message = f"Review with ID {review_id} not found" if review_id else "Review not found"
        super().__init__(message, 404)

class AnalysisException(APIException):
    """Raised when review analysis fails"""
    def __init__(self, message: str = "Failed to analyze review"):
        super().__init__(message, 422)

class DatabaseException(APIException):
    """Raised when database operation fails"""
    def __init__(self, message: str = "Database operation failed"):
        super().__init__(message, 500)

class ExternalAPIException(APIException):
    """Raised when external API call fails"""
    def __init__(self, service: str, message: str = None):
        error_msg = f"{service} API error" + (f": {message}" if message else "")
        super().__init__(error_msg, 503)
