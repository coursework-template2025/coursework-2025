import uuid
from typing import Sequence

from sqlalchemy import Select, select, true, func, case, and_, or_, literal
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.conversation import Conversation as ConversationEntity
from app.domain.repositories.conversation_repository import ConversationRepository
from app.infrastructure.db.models import models, user_models
from app.domain.enums.conversation_type import ConversationType


class ConversationRepositoryImpl(ConversationRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, conversation: ConversationEntity) -> ConversationEntity:
        model = models.Conversation(
            id=conversation.id,
            type=conversation.type,
            title=conversation.title,
            created_at=conversation.created_at,
        )
        self.session.add(model)
        await self.session.flush()
        return self._to_entity(model)

    async def get(self, conversation_id: uuid.UUID) -> ConversationEntity | None:
        query: Select[tuple[models.Conversation]] = select(models.Conversation).where(
            models.Conversation.id == conversation_id
        )
        result = await self.session.execute(query)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def list_for_user(self, user_id: int) -> Sequence[ConversationEntity]:
        last_message_subq = (
            select(models.Message.id, models.Message.created_at, models.Message.text,
                   models.Message.sender_id)
            .where(models.Message.conversation_id == models.Conversation.id)
            .order_by(models.Message.created_at.desc())
            .limit(1)
            .lateral()
        )
        partner_subq = (
            select(
                    user_models.Users.username,
            )
            .select_from(models.ConversationParticipant)
            .join(
                user_models.Users,
                user_models.Users.id == models.ConversationParticipant.user_id,
            )
            .where(
                and_(
                    models.ConversationParticipant.conversation_id == models.Conversation.id,
                    models.ConversationParticipant.user_id != user_id,
                )
            )
            .limit(1)
            .lateral()
        )
        query = (
            select(models.Conversation.id,
                   models.Conversation.type,
                   case(
                       (
                           models.Conversation.type==ConversationType.private,
                           partner_subq.c.username
                       ),
                   else_=models.Conversation.title)
                   .label("title"),
                   models.Conversation.created_at,
                   case(
                       (
                           last_message_subq.c.id.isnot(None),
                           func.json_build_object(
                               "id", last_message_subq.c.id,
                               "sender_id", last_message_subq.c.sender_id,
                               "text", last_message_subq.c.text,
                               "created_at", last_message_subq.c.created_at
                           ),
                       ),
                       else_=None)
                   .label("last_message"))
            .join(models.ConversationParticipant, models.ConversationParticipant.conversation_id==models.Conversation.id)
            .join(last_message_subq, true(), isouter=True)
            .where(models.ConversationParticipant.user_id == user_id)
            .order_by(models.Conversation.created_at.desc())
        )
        result = await self.session.execute(query)
        models_list = result.all()
        return models_list

    async def update_title(self, conversation_id: uuid.UUID, title: str | None) -> ConversationEntity | None:
        query = select(models.Conversation).where(models.Conversation.id == conversation_id)
        result = await self.session.execute(query)
        model = result.scalar_one_or_none()
        if not model:
            return None
        model.title = title
        await self.session.flush()
        return self._to_entity(model)

    async def delete(self, conversation_id: uuid.UUID) -> None:
        query = select(models.Conversation).where(models.Conversation.id == conversation_id)
        result = await self.session.execute(query)
        model = result.scalar_one_or_none()
        if model:
            await self.session.delete(model)
            await self.session.flush()

    @staticmethod
    def _to_entity(model: models.Conversation) -> ConversationEntity:
        return ConversationEntity(
            id=model.id,
            type=model.type,
            title=model.title,
            created_at=model.created_at,
        )

