"""
Backend middleware for request/response logging and error handling
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import time
import uuid
from typing import Callable, Any

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all requests and responses"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Any:
        # Generate unique request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Log incoming request
        logger.info(
            f"Request ID: {request_id} | "
            f"Method: {request.method} | "
            f"Path: {request.url.path}"
        )
        
        # Measure processing time
        start_time = time.time()
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Log response
            logger.info(
                f"Request ID: {request_id} | "
                f"Status: {response.status_code} | "
                f"Duration: {process_time:.2f}s"
            )
            
            # Add custom headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
        except Exception as exc:
            process_time = time.time() - start_time
            logger.error(
                f"Request ID: {request_id} | "
                f"Error: {str(exc)} | "
                f"Duration: {process_time:.2f}s"
            )
            raise

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Middleware to handle and format errors consistently"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Any:
        try:
            response = await call_next(request)
            return response
        except HTTPException as exc:
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "success": False,
                    "message": exc.detail,
                    "status_code": exc.status_code,
                    "timestamp": time.time()
                }
            )
        except Exception as exc:
            logger.error(f"Unhandled exception: {str(exc)}")
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "message": "Internal server error",
                    "status_code": 500,
                    "timestamp": time.time()
                }
            )
