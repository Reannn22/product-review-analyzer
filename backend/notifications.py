"""
Notification and messaging service
"""
from enum import Enum
from typing import Callable, List
from datetime import datetime

class NotificationType(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"

class Notification:
    def __init__(
        self,
        message: str,
        type: NotificationType = NotificationType.INFO,
        duration: int = 5000,
        id: str = None
    ):
        self.message = message
        self.type = type
        self.duration = duration
        self.id = id or str(datetime.now().timestamp())
        self.created_at = datetime.now()

class NotificationManager:
    """Manage application notifications"""
    
    def __init__(self):
        self._notifications: List[Notification] = []
        self._listeners: List[Callable] = []
    
    def notify(
        self,
        message: str,
        type: NotificationType = NotificationType.INFO,
        duration: int = 5000
    ) -> Notification:
        """Create and emit notification"""
        notification = Notification(message, type, duration)
        self._notifications.append(notification)
        self._emit(notification)
        return notification
    
    def success(self, message: str, duration: int = 3000) -> Notification:
        """Create success notification"""
        return self.notify(message, NotificationType.SUCCESS, duration)
    
    def error(self, message: str, duration: int = 5000) -> Notification:
        """Create error notification"""
        return self.notify(message, NotificationType.ERROR, duration)
    
    def warning(self, message: str, duration: int = 4000) -> Notification:
        """Create warning notification"""
        return self.notify(message, NotificationType.WARNING, duration)
    
    def info(self, message: str, duration: int = 3000) -> Notification:
        """Create info notification"""
        return self.notify(message, NotificationType.INFO, duration)
    
    def subscribe(self, listener: Callable) -> None:
        """Subscribe to notifications"""
        self._listeners.append(listener)
    
    def _emit(self, notification: Notification) -> None:
        """Emit notification to subscribers"""
        for listener in self._listeners:
            try:
                listener(notification)
            except Exception as e:
                print(f"Error in notification listener: {str(e)}")

# Global notification manager
notification_manager = NotificationManager()
