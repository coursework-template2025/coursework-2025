import uuid
from typing import Sequence

from sqlalchemy import Select, delete, select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.entities.message import Message as MessageEntity
from app.domain.repositories.message_repository import MessageRepository
from app.infrastructure.db.models import models


class MessageRepositoryImpl(MessageRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, message: MessageEntity) -> MessageEntity:
        stmt = (insert(models.Message).values(
            id=message.id,
            conversation_id=message.conversation_id,
            sender_id=message.sender_id,
            text=message.text,
            reply_to=message.reply_to,
            is_edited=message.is_edited,
            created_at=message.created_at,
        ).returning(models.Message)
                .options(selectinload(models.Message.sender)))
        msg = await self.session.execute(stmt)
        await self.session.flush()
        return self._to_entity(msg.scalars().one())

    async def list_for_conversation(self, conversation_id: uuid.UUID, limit: int, offset: int) -> Sequence[MessageEntity]:
        query: Select[tuple[models.Message]] = (
            select(models.Message)
            .where(models.Message.conversation_id == conversation_id)
            .options(selectinload(models.Message.sender))
            .order_by(models.Message.created_at)
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
        # return [self._to_entity(m) for m in models_list]

    async def get(self, message_id: uuid.UUID) -> MessageEntity | None:
        query = select(models.Message).where(models.Message.id == message_id)
        result = await self.session.execute(query)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def update_text(self, message_id: uuid.UUID, text: str) -> MessageEntity | None:
        query = select(models.Message).where(models.Message.id == message_id)
        result = await self.session.execute(query)
        model = result.scalar_one_or_none()
        if not model:
            return None
        model.text = text
        model.is_edited = True
        await self.session.flush()
        return self._to_entity(model)

    async def delete(self, message_id: uuid.UUID) -> None:
        await self.session.execute(delete(models.Message).where(models.Message.id == message_id))
        await self.session.flush()

    @staticmethod
    def _to_entity(model: models.Message) -> MessageEntity:
        return MessageEntity(
            id=model.id,
            conversation_id=model.conversation_id,
            sender_id=model.sender_id,
            text=model.text,
            reply_to=model.reply_to,
            is_edited=model.is_edited,
            created_at=model.created_at,
            avatar=model.sender.avatar if model.sender else None,
            username=model.sender.username if model.sender else None,
        )

