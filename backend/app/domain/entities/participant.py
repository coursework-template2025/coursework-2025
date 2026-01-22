import uuid
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from app.domain.enums.participant_type import ParticipantRole


@dataclass(slots=True)
class Participant:
    id: int | None
    conversation_id: uuid.UUID
    user_id: int
    role: ParticipantRole
    joined_at: datetime
    username: Optional[str] = None
    avatar: Optional[str] = None
