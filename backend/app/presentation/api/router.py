from fastapi import APIRouter

from app.presentation.api import attachments, conversations, messages, participants, users

api_router = APIRouter()
api_router.include_router(conversations.router)
api_router.include_router(participants.router)
api_router.include_router(messages.router)
api_router.include_router(attachments.router)
api_router.include_router(users.router)

