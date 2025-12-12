"""
Background task management for async operations
"""
import asyncio
import threading
from typing import Callable, Any, Optional
from datetime import datetime

class BackgroundTask:
    """Represents a background task"""
    
    def __init__(
        self,
        name: str,
        func: Callable,
        args: tuple = (),
        kwargs: dict = None
    ):
        self.name = name
        self.func = func
        self.args = args
        self.kwargs = kwargs or {}
        self.created_at = datetime.now()
        self.started_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None
        self.result: Any = None
        self.error: Optional[Exception] = None
        self.status = "pending"  # pending, running, completed, failed

class TaskManager:
    """Manage background tasks"""
    
    def __init__(self):
        self.tasks: dict[str, BackgroundTask] = {}
        self._lock = threading.Lock()
    
    def create_task(
        self,
        name: str,
        func: Callable,
        args: tuple = (),
        kwargs: dict = None
    ) -> BackgroundTask:
        """Create and queue a background task"""
        task = BackgroundTask(name, func, args, kwargs)
        
        with self._lock:
            self.tasks[task.name] = task
        
        # Run task in thread
        thread = threading.Thread(target=self._run_task, args=(task,), daemon=True)
        thread.start()
        
        return task
    
    def _run_task(self, task: BackgroundTask) -> None:
        """Run a task and handle errors"""
        task.status = "running"
        task.started_at = datetime.now()
        
        try:
            task.result = task.func(*task.args, **task.kwargs)
            task.status = "completed"
        except Exception as e:
            task.error = e
            task.status = "failed"
        finally:
            task.completed_at = datetime.now()
    
    def get_task(self, name: str) -> Optional[BackgroundTask]:
        """Get task by name"""
        with self._lock:
            return self.tasks.get(name)
    
    def cancel_task(self, name: str) -> bool:
        """Cancel a pending task"""
        with self._lock:
            if name in self.tasks:
                task = self.tasks[name]
                if task.status == "pending":
                    task.status = "cancelled"
                    return True
        return False

# Global task manager
task_manager = TaskManager()
