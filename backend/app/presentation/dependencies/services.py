from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.user_service import UserService
from app.application.services.chat_service import ChatService
from app.infrastructure.db.session import get_session
from app.infrastructure.repositories_impl.attachment_repository_impl import AttachmentRepositoryImpl
from app.infrastructure.repositories_impl.conversation_repository_impl import ConversationRepositoryImpl
from app.infrastructure.repositories_impl.message_repository_impl import MessageRepositoryImpl
from app.infrastructure.repositories_impl.participant_repository_impl import ParticipantRepositoryImpl
from app.infrastructure.repositories_impl.user_repository_impl import UserRepositoryImpl
from app.application.security import password_hasher


async def get_chat_service(session: AsyncSession = Depends(get_session)) -> ChatService:
    conversation_repo = ConversationRepositoryImpl(session)
    participant_repo = ParticipantRepositoryImpl(session)
    message_repo = MessageRepositoryImpl(session)
    attachment_repo = AttachmentRepositoryImpl(session)
    return ChatService(
        session=session,
        conversation_repo=conversation_repo,
        participant_repo=participant_repo,
        message_repo=message_repo,
        attachment_repo=attachment_repo,
    )

async def get_user_service(session: AsyncSession = Depends(get_session)) -> UserService:
    user_repo = UserRepositoryImpl(session)
    return UserService(
        session=session,
        user_repo=user_repo,
        password_hasher=password_hasher.BcryptPasswordHasher()
    )