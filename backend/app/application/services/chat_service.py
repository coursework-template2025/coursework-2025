import uuid
from datetime import datetime
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.application.dto.attachment_dto import AttachmentCreateDTO
from app.application.dto.conversation_dto import ConversationCreateDTO
from app.application.dto.message_dto import MessageCreateDTO, MessageUpdateDTO
from app.domain.entities.attachment import Attachment
from app.domain.entities.conversation import Conversation
from app.domain.entities.message import Message
from app.domain.entities.participant import Participant
from app.domain.repositories.attachment_repository import AttachmentRepository
from app.domain.repositories.conversation_repository import ConversationRepository
from app.domain.repositories.message_repository import MessageRepository
from app.domain.repositories.participant_repository import ParticipantRepository
from app.domain.enums.participant_type import ParticipantRole


class ChatService:
    def __init__(
        self,
        session: AsyncSession,
        conversation_repo: ConversationRepository,
        participant_repo: ParticipantRepository,
        message_repo: MessageRepository,
        attachment_repo: AttachmentRepository,
        max_attachment_size: int = 20 * 1024 * 1024,
    ):
        self.session = session
        self.conversation_repo = conversation_repo
        self.participant_repo = participant_repo
        self.message_repo = message_repo
        self.attachment_repo = attachment_repo
        self.max_attachment_size = max_attachment_size

    async def create_conversation(self, creator_id: int, dto: ConversationCreateDTO) -> Conversation:
        conversation = Conversation(
            id=uuid.uuid4(),
            type=dto.type,
            title=dto.title,
            created_at=datetime.utcnow(),
        )
        conversation = await self.conversation_repo.create(conversation)
        # creator is admin
        await self.participant_repo.add(
            Participant(
                id=None,
                conversation_id=conversation.id,
                user_id=creator_id,
                role=ParticipantRole.admin,
                joined_at=datetime.utcnow(),
            )
        )
        for participant_id in set(dto.participant_ids):
            if participant_id == creator_id:
                continue
            await self.participant_repo.add(
                Participant(
                    id=None,
                    conversation_id=conversation.id,
                    user_id=participant_id,
                    role=ParticipantRole.member,
                    joined_at=datetime.utcnow(),
                )
            )
        await self.session.commit()
        return conversation

    async def list_conversations(self, user_id: int):
        return await self.conversation_repo.list_for_user(user_id)

    async def get_conversation(self, user_id: int, conversation_id: uuid.UUID):
        await self._ensure_is_participant(user_id, conversation_id)
        conversation = await self.conversation_repo.get(conversation_id)
        if not conversation:
            raise ValueError("Conversation not found")
        return conversation

    async def rename_conversation(self, user_id: int, conversation_id: uuid.UUID, title: str | None):
        await self._ensure_is_admin(user_id, conversation_id)
        conversation = await self.conversation_repo.update_title(conversation_id, title)
        await self.session.commit()
        return conversation

    async def delete_conversation(self, user_id: int, conversation_id: uuid.UUID):
        await self._ensure_is_admin(user_id, conversation_id)
        await self.conversation_repo.delete(conversation_id)
        await self.session.commit()

    async def add_participant(self, user_id: int, conversation_id: uuid.UUID, target_user_id: int):
        await self._ensure_is_admin(user_id, conversation_id)
        existing = await self.participant_repo.get(conversation_id, target_user_id)
        if existing:
            return existing
        participant = await self.participant_repo.add(
            Participant(
                id=None,
                conversation_id=conversation_id,
                user_id=target_user_id,
                role=ParticipantRole.member,
                joined_at=datetime.utcnow(),
            )
        )
        await self.session.commit()
        return participant

    async def remove_participant(self, user_id: int, conversation_id: uuid.UUID, target_user_id: int):
        await self._ensure_is_admin(user_id, conversation_id)
        await self.participant_repo.remove(conversation_id, target_user_id)
        await self.session.commit()

    async def send_message(self, user_id: int, dto: MessageCreateDTO) -> Message:
        await self._ensure_is_participant(user_id, dto.conversation_id)
        message = Message(
            id=uuid.uuid4(),
            conversation_id=dto.conversation_id,
            sender_id=user_id,
            text=dto.text,
            reply_to=dto.reply_to,
            is_edited=False,
            created_at=datetime.utcnow(),
        )
        message = await self.message_repo.create(message)
        await self.session.commit()
        return message

    async def list_messages(self, user_id: int, conversation_id: uuid.UUID, limit: int = 50, offset: int = 0):
        await self._ensure_is_participant(user_id, conversation_id)
        return await self.message_repo.list_for_conversation(conversation_id, limit, offset)

    async def update_message(self, user_id: int, message_id: uuid.UUID, dto: MessageUpdateDTO):
        message = await self.message_repo.get(message_id)
        if not message:
            raise ValueError("Message not found")
        if message.sender_id != user_id:
            raise PermissionError("Cannot edit another user's message")
        updated = await self.message_repo.update_text(message_id, dto.text)
        await self.session.commit()
        return updated

    async def delete_message(self, user_id: int, message_id: uuid.UUID):
        message = await self.message_repo.get(message_id)
        if not message:
            return
        if message.sender_id != user_id:
            raise PermissionError("Cannot delete another user's message")
        await self.message_repo.delete(message_id)
        await self.session.commit()

    async def attach_file(self, user_id: int, dto: AttachmentCreateDTO):
        message = await self.message_repo.get(dto.message_id)
        if not message:
            raise ValueError("Message not found")
        await self._ensure_is_participant(user_id, message.conversation_id)
        if dto.file_size > self.max_attachment_size:
            raise ValueError("File is too large")
        attachment = Attachment(
            id=None,
            message_id=dto.message_id,
            file_url=dto.file_url,
            file_type=dto.file_type,
            file_size=dto.file_size,
            created_at=datetime.utcnow(),
        )
        attachment = await self.attachment_repo.create(attachment)
        await self.session.commit()
        return attachment

    async def _ensure_is_admin(self, user_id: int, conversation_id: uuid.UUID):
        participant = await self.participant_repo.get(conversation_id, user_id)
        if not participant:
            raise PermissionError("User is not participant of the conversation")
        if participant.role != ParticipantRole.admin:
            raise PermissionError("User is not admin of the conversation")

    async def _ensure_is_participant(self, user_id: int, conversation_id: uuid.UUID):
        participant = await self.participant_repo.get(conversation_id, user_id)
        if not participant:
            raise PermissionError("User is not participant of the conversation")

    # Public helper for WebSocket / other layers
    async def ensure_participant(self, user_id: int, conversation_id: uuid.UUID) -> None:
        await self._ensure_is_participant(user_id, conversation_id)

    async def participants_by_conversations(self, conversation_id: uuid.UUID) -> List[Participant]:
        return await self.participant_repo.list_by_conversation(conversation_id)
