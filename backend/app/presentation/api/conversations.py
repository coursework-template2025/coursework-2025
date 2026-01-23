import uuid

from fastapi import APIRouter, Depends, HTTPException, status, Request

from app.application.dto.conversation_dto import ConversationCreateDTO, ConversationReadDTO
from app.application.services.chat_service import ChatService
from app.presentation.dependencies.auth import get_current_user_id, security
from app.presentation.dependencies.services import get_chat_service

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("/", response_model=ConversationReadDTO, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    dto: ConversationCreateDTO,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        conversation = await service.create_conversation(current_user_id, dto)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return conversation


@router.get("/", response_model=list[ConversationReadDTO])
async def list_conversations(
        service: ChatService = Depends(get_chat_service),
        current_user_id: str = Depends(get_current_user_id),
):
    return await service.list_conversations(current_user_id)

@router.get("/{conversation_id}", response_model=ConversationReadDTO)
async def get_conversation(
    conversation_id: uuid.UUID,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        return await service.get_conversation(current_user_id, conversation_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.put("/{conversation_id}", response_model=ConversationReadDTO)
async def rename_conversation(
    conversation_id: uuid.UUID,
    title: str | None,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        return await service.rename_conversation(current_user_id, conversation_id, title)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: uuid.UUID,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        await service.delete_conversation(current_user_id, conversation_id)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

