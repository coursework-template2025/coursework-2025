import uuid
from typing import Sequence

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.attachment import Attachment as AttachmentEntity
from app.domain.repositories.attachment_repository import AttachmentRepository
from app.infrastructure.db.models import models


class AttachmentRepositoryImpl(AttachmentRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, attachment: AttachmentEntity) -> AttachmentEntity:
        model = models.Attachment(
            message_id=attachment.message_id,
            file_url=attachment.file_url,
            file_type=attachment.file_type,
            file_size=attachment.file_size,
            created_at=attachment.created_at,
        )
        self.session.add(model)
        await self.session.flush()
        return self._to_entity(model)

    async def list_for_message(self, message_id: uuid.UUID) -> Sequence[AttachmentEntity]:
        query: Select[tuple[models.Attachment]] = select(models.Attachment).where(
            models.Attachment.message_id == message_id
        )
        result = await self.session.execute(query)
        models_list = result.scalars().all()
        return [self._to_entity(m) for m in models_list]

    @staticmethod
    def _to_entity(model: models.Attachment) -> AttachmentEntity:
        return AttachmentEntity(
            id=model.id,
            message_id=model.message_id,
            file_url=model.file_url,
            file_type=model.file_type,
            file_size=model.file_size,
            created_at=model.created_at,
        )

