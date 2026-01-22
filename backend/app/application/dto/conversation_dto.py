import uuid
from datetime import datetime

from pydantic import BaseModel, Field, field_serializer

from app.domain.enums import participant_type, conversation_type
from app.application.dto import message_dto
from typing import Optional

class ConversationCreateDTO(BaseModel):
    type: conversation_type.ConversationType
    title: str | None = None
    participant_ids: list[int] = Field(default_factory=list)


class Message(BaseModel):
    id: uuid.UUID
    sender_id: int
    text: str | None
    created_at: datetime


class ConversationReadDTO(BaseModel):
    id: uuid.UUID
    type: conversation_type.ConversationType
    title: str | None
    created_at: datetime
    last_message: Optional[Message] | None = None

    class Config:
        from_attributes = True
