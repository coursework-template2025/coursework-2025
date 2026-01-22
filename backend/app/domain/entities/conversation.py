import uuid
from dataclasses import dataclass
from datetime import datetime

from app.domain.enums.conversation_type import ConversationType


@dataclass(slots=True)
class Conversation:
    id: uuid.UUID
    type: ConversationType
    title: str | None
    created_at: datetime

