import uuid
from datetime import datetime
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.security.interfaces import PasswordHasher
from app.domain.entities.participant import Participant
from app.domain.entities.user import User
from app.domain.enums.participant_type import ParticipantRole
from app.domain.repositories.user_repository import UserRepository
from app.application.dto import user_dto


class UserService:
    def __init__(
        self,
        session: AsyncSession,
        user_repo: UserRepository,
        password_hasher: PasswordHasher,
        max_attachment_size: int = 20 * 1024 * 1024,
    ):
        self.session = session
        self.user_repo = user_repo
        self.password_hasher = password_hasher
        self.max_attachment_size = max_attachment_size

    async def register(self, dto: user_dto.UserRegisterDTO) -> User:
        password = self.password_hasher.hash(password=dto.password)
        user = User(
            id=None,
            username=dto.username,
            email=dto.email,
            created_at=datetime.utcnow(),
            password=password,
        )
        await self.user_repo.create(user)

    async def get_users_by_username_email(self, username: str) -> List[User]:
        return await self.user_repo.get_users_by_username_email(username=username)
