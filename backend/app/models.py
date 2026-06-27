from sqlalchemy import Column, String, DateTime
from datetime import datetime, timezone
import uuid
import enum
from .database import Base

class TaskStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    
class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default=TaskStatus.pending)
    priority = Column(String, default=TaskPriority.medium)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))