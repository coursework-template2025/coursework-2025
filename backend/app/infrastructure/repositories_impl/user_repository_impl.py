import uuid
from typing import Sequence

import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.user import User as UserEntity
from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.db.models import user_models


class UserRepositoryImpl(UserRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user: UserEntity) -> UserEntity:
        model = user_models.Users(
            username=user.username,
            avatar=user.avatar,
            email=user.email,
            password=user.password,
            created_at=user.created_at,
        )
        self.session.add(model)
        await self.session.flush()
        return self._to_entity(model)

    async def get_user_by_username_email(self, username: str) -> UserEntity:
        query = sa.select(user_models.Users).where(
            sa.or_(user_models.Users.username == username,
                   user_models.Users.email == username)).limit(1)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_user_by_id(self, int):
        query = (sa.select(user_models.Users)
                 .where(user_models.Users.id == int).limit(1))
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_users_by_username_email(self, username: str) -> UserEntity:
        query = sa.select(user_models.Users).where(
            sa.or_(user_models.Users.username.like(f"%{username}%"),
                   user_models.Users.email.like(f"%{username}%")))
        result = await self.session.execute(query)
        return result.scalars().all()

    @staticmethod
    def _to_entity(model: user_models.Users) -> UserEntity:
        return UserEntity(
            id=model.id,
            username=model.username,
            avatar=model.avatar,
            email=model.email,
            created_at=model.created_at,
            password=model.password
        )

