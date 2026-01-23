import uuid
from datetime import datetime

from pydantic import BaseModel

from app.domain.enums.attachment_type import AttachmentType


class AttachmentCreateDTO(BaseModel):
    message_id: uuid.UUID
    file_url: str
    file_type: AttachmentType
    file_size: int


class AttachmentReadDTO(BaseModel):
    id: int
    message_id: uuid.UUID
    file_url: str
    file_type: AttachmentType
    file_size: int
    created_at: datetime

    class Config:
        from_attributes = True

