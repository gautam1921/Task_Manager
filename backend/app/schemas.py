from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional
from .models import TaskStatus, TaskPriority

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, description="Title is strictly required")
    description: str
    priority: TaskPriority = TaskPriority.medium

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None

class TaskResponse(TaskBase):
    id: str
    status: TaskStatus
    created_at: datetime

    # This tells Pydantic to read data even if it's an ORM model, not a dictionary
    model_config = ConfigDict(from_attributes=True)