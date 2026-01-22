import uuid
from abc import ABC, abstractmethod
from typing import Sequence

from app.domain.entities.attachment import Attachment


class AttachmentRepository(ABC):
    @abstractmethod
    async def create(self, attachment: Attachment) -> Attachment: ...

    @abstractmethod
    async def list_for_message(self, message_id: uuid.UUID) -> Sequence[Attachment]: ...

