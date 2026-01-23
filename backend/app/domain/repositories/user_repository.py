import uuid
from abc import ABC, abstractmethod
from typing import Sequence

from app.domain.entities.user import User


class UserRepository(ABC):
    @abstractmethod
    async def create(self, attachment: User) -> User: ...

    @abstractmethod
    async def get_user_by_username_email(self, username: str) -> User: ...

    @abstractmethod
    async def get_users_by_username_email(self, username: str) -> Sequence[User]: ...

    @abstractmethod
    async def get_user_by_id(self, id: int) -> User: ...
