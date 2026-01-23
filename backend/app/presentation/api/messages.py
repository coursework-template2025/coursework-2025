import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.application.dto.message_dto import MessageCreateDTO, MessageReadDTO, MessageUpdateDTO
from app.application.services.chat_service import ChatService
from app.presentation.dependencies.auth import get_current_user_id
from app.presentation.dependencies.services import get_chat_service

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/", response_model=MessageReadDTO, status_code=status.HTTP_201_CREATED)
async def send_message(
    dto: MessageCreateDTO,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        return await service.send_message(current_user_id, dto)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.get("/{conversation_id}", response_model=list[MessageReadDTO])
async def list_messages(
    conversation_id: uuid.UUID,
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    return await service.list_messages(current_user_id, conversation_id, limit, offset)


@router.put("/{message_id}", response_model=MessageReadDTO)
async def update_message(
    message_id: uuid.UUID,
    dto: MessageUpdateDTO,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        return await service.update_message(current_user_id, message_id, dto)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    message_id: uuid.UUID,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        await service.delete_message(current_user_id, message_id)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc

