"""
API documentation strings and endpoint descriptions
"""

PRODUCT_ENDPOINTS = {
    "create": "Create a new product for review analysis",
    "list": "Get list of all products with pagination",
    "get": "Get detailed information about a specific product",
    "update": "Update product information",
    "delete": "Delete a product and all its reviews",
}

REVIEW_ENDPOINTS = {
    "create": "Submit a new review for sentiment analysis",
    "list": "Get all reviews for a specific product",
    "get": "Get detailed information about a specific review",
    "delete": "Delete a review",
}

ANALYSIS_ENDPOINTS = {
    "analyze": "Analyze sentiment and extract key points from review text",
    "stats": "Get sentiment statistics for a product",
    "health": "Check API health status",
}

API_DESCRIPTIONS = {
    "sentiment_analysis": "Analyze review sentiment using Hugging Face Transformers",
    "key_points_extraction": "Extract key points from reviews using Google Gemini API",
    "sentiment_distribution": "Calculate sentiment distribution across all reviews",
    "confidence_score": "Confidence level of sentiment prediction (0-1 scale)",
}

ERROR_RESPONSES = {
    400: "Bad Request - Invalid input parameters",
    401: "Unauthorized - Authentication required",
    404: "Not Found - Resource does not exist",
    422: "Unprocessable Entity - Validation error",
    500: "Internal Server Error - Server-side error occurred",
    503: "Service Unavailable - External service unreachable",
}
