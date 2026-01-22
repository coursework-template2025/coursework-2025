import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.application.services.chat_service import ChatService
from app.domain.enums.participant_type import ParticipantRole
from app.presentation.dependencies.auth import get_current_user_id
from app.presentation.dependencies.services import get_chat_service
from app.application.dto.participant_dto import ParticipantReadDTO

router = APIRouter(prefix="/conversations/{conversation_id}/participants", tags=["participants"])


class ParticipantAddRequest(BaseModel):
    user_id: int
    role: ParticipantRole | None = None


@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_participant(
    conversation_id: uuid.UUID,
    payload: ParticipantAddRequest,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        participant = await service.add_participant(current_user_id, conversation_id, payload.user_id)
        if payload.role:
            participant = await service.participant_repo.update_role(conversation_id, payload.user_id, payload.role)
            await service.session.commit()
        return participant
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_participant(
    conversation_id: uuid.UUID,
    user_id: int,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        await service.remove_participant(current_user_id, conversation_id, user_id)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc

@router.get("", response_model=List[ParticipantReadDTO])
async def get_participants(
        conversation_id: uuid.UUID,
        service: ChatService = Depends(get_chat_service),
        current_user_id: int = Depends(get_current_user_id)
        ):
    return await service.participants_by_conversations(conversation_id)