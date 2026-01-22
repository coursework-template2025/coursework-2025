import uuid
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass(slots=True)
class Message:
    id: uuid.UUID
    conversation_id: uuid.UUID
    sender_id: int
    text: str | None
    reply_to: uuid.UUID | None
    is_edited: bool
    created_at: datetime
    avatar: Optional[str] = None
    username: Optional[str] = None
