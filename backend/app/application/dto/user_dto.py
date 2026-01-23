from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.domain.enums import participant_type

class ParticipantReadDTO(BaseModel):
    user_id: int
    role: participant_type.ParticipantRole
    joined_at: datetime
    username: str
    avatar: str | None

    class Config:
        from_attributes = True


class UserRegisterDTO(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLoginDTO(BaseModel):
    username: str
    password: str

class UserReadDTO(BaseModel):
    id: int
    username: str
    email: EmailStr
    avatar: str | None

    class Config:
        from_attributes = True
