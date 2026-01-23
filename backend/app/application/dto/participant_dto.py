from typing import Optional
from datetime import datetime

from pydantic import BaseModel

from app.domain.enums import participant_type

class ParticipantReadDTO(BaseModel):
    user_id: int
    role: participant_type.ParticipantRole
    joined_at: datetime
    first_name: str
    last_name: str
    avatar: str | None

    class Config:
        from_attributes = True