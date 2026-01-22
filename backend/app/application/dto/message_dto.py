import uuid
from datetime import datetime

from pydantic import BaseModel


class MessageCreateDTO(BaseModel):
    conversation_id: uuid.UUID
    sender_id: int
    text: str | None = None
    reply_to: uuid.UUID | None = None


class MessageUpdateDTO(BaseModel):
    text: str


class MessageReadDTO(BaseModel):
    id: uuid.UUID
    conversation_id: uuid.UUID
    sender_id: int
    text: str | None
    reply_to: uuid.UUID | None
    is_edited: bool
    created_at: datetime
    avatar: str | None = None
    username: str | None = None

    class Config:
        from_attributes = True

