import uuid
from typing import Sequence

from sqlalchemy import Select, delete, select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.entities.participant import Participant as ParticipantEntity
from app.domain.repositories.participant_repository import ParticipantRepository
from app.infrastructure.db.models import models
from app.domain.enums.participant_type import ParticipantRole


class ParticipantRepositoryImpl(ParticipantRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, participant: ParticipantEntity) -> ParticipantEntity:
        stmt = (insert(models.ConversationParticipant).values(
            conversation_id=participant.conversation_id,
            user_id=participant.user_id,
            role=participant.role,
            joined_at=participant.joined_at,
        ).returning(models.ConversationParticipant)
                .options(selectinload(models.ConversationParticipant.user)))
        msg = await self.session.execute(stmt)
        await self.session.flush()
        return self._to_entity(msg.scalars().one())

    async def list_by_conversation(self, conversation_id: uuid.UUID) -> Sequence[ParticipantEntity]:
        query: Select[tuple[models.ConversationParticipant]] = select(models.ConversationParticipant).where(
            models.ConversationParticipant.conversation_id == conversation_id
        ).options(selectinload(models.ConversationParticipant.user))
        result = await self.session.execute(query)
        models_list = result.scalars().all()
        return [self._to_entity(m) for m in models_list]

    async def get(self, conversation_id: uuid.UUID, user_id: int) -> ParticipantEntity | None:
        query = select(models.ConversationParticipant).where(
            models.ConversationParticipant.conversation_id == conversation_id,
            models.ConversationParticipant.user_id == user_id,
        ).options(selectinload(models.ConversationParticipant.user))
        result = await self.session.execute(query)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def remove(self, conversation_id: uuid.UUID, user_id: int) -> None:
        query = delete(models.ConversationParticipant).where(
            models.ConversationParticipant.conversation_id == conversation_id,
            models.ConversationParticipant.user_id == user_id,
        )
        await self.session.execute(query)
        await self.session.flush()

    async def update_role(self, conversation_id: uuid.UUID, user_id: int, role: ParticipantRole) -> ParticipantEntity | None:
        query = select(models.ConversationParticipant).where(
            models.ConversationParticipant.conversation_id == conversation_id,
            models.ConversationParticipant.user_id == user_id,
        )
        result = await self.session.execute(query)
        model = result.scalar_one_or_none()
        if not model:
            return None
        model.role = role
        await self.session.flush()
        return self._to_entity(model)

    @staticmethod
    def _to_entity(model: models.ConversationParticipant) -> ParticipantEntity:
        return ParticipantEntity(
            id=model.id,
            conversation_id=model.conversation_id,
            user_id=model.user_id,
            role=model.role,
            joined_at=model.joined_at,
            username=model.user.username if model.user else None,
            avatar=model.user.avatar if model.user else None,
        )

