import uuid
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass(slots=True)
class User:
    id: int
    username: str
    email: str
    created_at: datetime
    password: Optional[str] = None
    avatar: Optional[str] = None

