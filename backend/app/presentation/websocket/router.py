from fastapi import APIRouter

from app.presentation.websocket import conversations_ws

ws_router = APIRouter()
ws_router.include_router(conversations_ws.router)
