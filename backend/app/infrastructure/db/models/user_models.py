import uuid
from datetime import datetime

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.infrastructure.db.base import Base

class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(sa.String, unique=True)
    email: Mapped[str] = mapped_column(sa.String, unique=True)
    avatar: Mapped[str] = mapped_column(sa.String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    password: Mapped[str] = mapped_column(sa.String)

    participants: Mapped[list["ConversationParticipant"]] = relationship(
        "ConversationParticipant",
        back_populates="user")
    messages: Mapped[list["Message"]] = relationship(
        "Message",
        back_populates="sender")
