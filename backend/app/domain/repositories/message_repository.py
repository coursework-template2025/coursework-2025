import uuid
from abc import ABC, abstractmethod
from typing import Sequence

from app.domain.entities.message import Message


class MessageRepository(ABC):
    @abstractmethod
    async def create(self, message: Message) -> Message: ...

    @abstractmethod
    async def list_for_conversation(self, conversation_id: uuid.UUID, limit: int, offset: int) -> Sequence[Message]: ...

    @abstractmethod
    async def get(self, message_id: uuid.UUID) -> Message | None: ...

    @abstractmethod
    async def update_text(self, message_id: uuid.UUID, text: str) -> Message | None: ...

    @abstractmethod
    async def delete(self, message_id: uuid.UUID) -> None: ...

