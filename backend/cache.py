"""
Cache management for API responses
"""
from typing import Any, Optional, Dict
from datetime import datetime, timedelta
import json

class CacheEntry:
    def __init__(self, data: Any, ttl_seconds: int = 300):
        self.data = data
        self.created_at = datetime.now()
        self.ttl = ttl_seconds
    
    def is_expired(self) -> bool:
        return datetime.now() - self.created_at > timedelta(seconds=self.ttl)

class APICache:
    """Simple in-memory cache for API responses"""
    
    def __init__(self):
        self._cache: Dict[str, CacheEntry] = {}
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        if key in self._cache:
            entry = self._cache[key]
            if not entry.is_expired():
                return entry.data
            else:
                del self._cache[key]
        return None
    
    def set(self, key: str, data: Any, ttl_seconds: int = 300) -> None:
        """Set value in cache with TTL"""
        self._cache[key] = CacheEntry(data, ttl_seconds)
    
    def delete(self, key: str) -> None:
        """Delete value from cache"""
        if key in self._cache:
            del self._cache[key]
    
    def clear(self) -> None:
        """Clear entire cache"""
        self._cache.clear()
    
    def cleanup_expired(self) -> int:
        """Remove expired entries and return count"""
        expired_keys = [
            key for key, entry in self._cache.items()
            if entry.is_expired()
        ]
        for key in expired_keys:
            del self._cache[key]
        return len(expired_keys)

# Global cache instance
cache = APICache()
