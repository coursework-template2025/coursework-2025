import uuid
from abc import ABC, abstractmethod
from typing import Sequence

from app.domain.entities.participant import Participant
from app.domain.enums.participant_type import ParticipantRole


class ParticipantRepository(ABC):
    @abstractmethod
    async def add(self, participant: Participant) -> Participant: ...

    @abstractmethod
    async def list_by_conversation(self, conversation_id: uuid.UUID) -> Sequence[Participant]: ...

    @abstractmethod
    async def get(self, conversation_id: uuid.UUID, user_id: int) -> Participant | None: ...

    @abstractmethod
    async def remove(self, conversation_id: uuid.UUID, user_id: int) -> None: ...

    @abstractmethod
    async def update_role(self, conversation_id: uuid.UUID, user_id: int, role: ParticipantRole) -> Participant | None: ...

