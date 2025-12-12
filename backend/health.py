"""
Health check and status monitoring
"""
from typing import Dict, Any
from datetime import datetime
import psutil
import platform

class HealthCheck:
    """Monitor application health"""
    
    @staticmethod
    def get_system_info() -> Dict[str, Any]:
        """Get system information"""
        return {
            "platform": platform.system(),
            "platform_version": platform.version(),
            "python_version": platform.python_version(),
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
        }
    
    @staticmethod
    def get_app_health(db_healthy: bool = True) -> Dict[str, Any]:
        """Get application health status"""
        return {
            "status": "healthy" if db_healthy else "degraded",
            "timestamp": datetime.utcnow().isoformat(),
            "components": {
                "api": "ok",
                "database": "ok" if db_healthy else "error",
                "external_services": "ok",
            },
            "uptime_seconds": None,  # Calculate based on start time
            "version": "1.0.0",
        }

def health_check_route(db_healthy: bool = True) -> Dict[str, Any]:
    """Health check endpoint handler"""
    return {
        **HealthCheck.get_app_health(db_healthy),
        "system": HealthCheck.get_system_info(),
    }
