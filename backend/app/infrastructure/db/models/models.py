import enum
import uuid
from datetime import datetime

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.infrastructure.db.base import Base
from app.domain.enums import conversation_type, participant_type, attachment_type
from app.infrastructure.db.models.user_models import Users


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type: Mapped[conversation_type.ConversationType] = (
        mapped_column(sa.Enum(conversation_type.ConversationType, name="conversation_type"), nullable=False))
    title: Mapped[str | None] = mapped_column(sa.String, nullable=True)
    creator_id: Mapped[int] = mapped_column(sa.ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    participants: Mapped[list["ConversationParticipant"]] = relationship(
        "ConversationParticipant", back_populates="conversation", cascade="all, delete-orphan"
    )
    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="conversation", cascade="all, delete-orphan"
    )


class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    conversation_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("conversations.id", ondelete="CASCADE"))
    user_id: Mapped[int] = mapped_column(sa.ForeignKey("users.id", ondelete="RESTRICT"))
    role: Mapped[participant_type.ParticipantRole] = (
        mapped_column(sa.Enum(participant_type.ParticipantRole, name="participant_role"), nullable=False))
    joined_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    user: Mapped[Users] = relationship("Users", back_populates="participants")
    conversation: Mapped[Conversation] = relationship("Conversation", back_populates="participants")
    # messages: Mapped[list["Message"]] = relationship("Message", back_populates="sender")

    __table_args__ = (
        sa.CheckConstraint("role in ('admin', 'member')", name="participant_role_check"),
    )


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("conversations.id", ondelete="CASCADE"))
    sender_id: Mapped[int] = mapped_column(sa.ForeignKey("users.id", ondelete="RESTRICT"))
    text: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    reply_to: Mapped[uuid.UUID | None] = mapped_column(sa.ForeignKey("messages.id", ondelete="SET NULL"), nullable=True)
    is_edited: Mapped[bool] = mapped_column(sa.Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    sender: Mapped["Users"] = relationship("Users", back_populates="messages")

    conversation: Mapped[Conversation] = relationship("Conversation", back_populates="messages")
    attachments: Mapped[list["Attachment"]] = relationship(
        "Attachment", back_populates="message", cascade="all, delete-orphan"
    )
    reply_to_message: Mapped["Message"] = relationship("Message", remote_side=[id])


class Attachment(Base):
    __tablename__ = "attachments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    message_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("messages.id", ondelete="CASCADE"))
    file_url: Mapped[str] = mapped_column(sa.Text, nullable=False)
    file_type: Mapped[attachment_type.AttachmentType] = mapped_column(sa.Enum(attachment_type.AttachmentType, name="attachment_type"), nullable=False)
    file_size: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    message: Mapped[Message] = relationship("Message", back_populates="attachments")

    __table_args__ = (
        sa.CheckConstraint("file_size >= 0", name="attachment_size_check"),
    )

