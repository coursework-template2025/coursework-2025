from uuid import UUID

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from app.application.dto.message_dto import MessageCreateDTO, MessageReadDTO, MessageUpdateDTO
from app.application.services.chat_service import ChatService
from app.infrastructure.websocket.connection_manager import manager as connection_manager
from app.presentation.dependencies.services import get_chat_service
from app.presentation.dependencies.auth import _get_user_id_from_ws

router = APIRouter()

@router.websocket("/conversations/{conversation_id}/")
async def websocket_conversations(
    websocket: WebSocket,
    conversation_id: UUID,
    service: ChatService = Depends(get_chat_service),
) -> None:
    channel = f"conversation:{conversation_id}"

    try:
        user_id = _get_user_id_from_ws(websocket)
    except ValueError:
        await websocket.close(code=1008)
        return

    # Проверяем, что пользователь участник чата
    try:
        await service.ensure_participant(user_id, conversation_id)
    except PermissionError:
        await websocket.close(code=1008)
        return

    await connection_manager.connect(websocket, user_id, channel)

    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")
            payload = data.get("payload") or {}

            # Новое сообщение
            if event_type == "message:new":
                msg_dto = MessageCreateDTO(
                    conversation_id=conversation_id,
                    sender_id=user_id,
                    text=payload.get("text"),
                    reply_to=payload.get("reply_to"),
                )
                msg = await service.send_message(user_id, msg_dto)
                ws_payload = MessageReadDTO(
                    id=msg.id,
                    conversation_id=msg.conversation_id,
                    sender_id=msg.sender_id,
                    text=msg.text,
                    reply_to=msg.reply_to,
                    is_edited=msg.is_edited,
                    created_at=msg.created_at,
                    avatar=msg.avatar,
                    username=msg.username
                ).model_dump(mode="json")
                await connection_manager.broadcast(
                    channel,
                    {"type": "message:new", "payload": ws_payload},
                )

    except WebSocketDisconnect:
        connection_manager.disconnect(user_id, channel)
