import uuid
from dataclasses import dataclass
from datetime import datetime

from app.domain.enums.attachment_type import AttachmentType


@dataclass(slots=True)
class Attachment:
    id: int | None
    message_id: uuid.UUID
    file_url: str
    file_type: AttachmentType
    file_size: int
    created_at: datetime

