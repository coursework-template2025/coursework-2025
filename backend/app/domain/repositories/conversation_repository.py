import uuid
from abc import ABC, abstractmethod
from typing import Sequence

from app.domain.entities.conversation import Conversation


class ConversationRepository(ABC):
    @abstractmethod
    async def create(self, conversation: Conversation) -> Conversation: ...

    @abstractmethod
    async def get(self, conversation_id: uuid.UUID) -> Conversation | None: ...

    @abstractmethod
    async def list_for_user(self, user_id: int) -> Sequence[Conversation]: ...

    @abstractmethod
    async def update_title(self, conversation_id: uuid.UUID, title: str | None) -> Conversation | None: ...

    @abstractmethod
    async def delete(self, conversation_id: uuid.UUID) -> None: ...

