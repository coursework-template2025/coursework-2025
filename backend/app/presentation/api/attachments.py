from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dto.attachment_dto import AttachmentCreateDTO, AttachmentReadDTO
from app.application.services.chat_service import ChatService
from app.presentation.dependencies.auth import get_current_user_id
from app.presentation.dependencies.services import get_chat_service

router = APIRouter(prefix="/attachments", tags=["attachments"])


@router.post("/", response_model=AttachmentReadDTO, status_code=status.HTTP_201_CREATED)
async def upload_attachment(
    dto: AttachmentCreateDTO,
    current_user_id: int = Depends(get_current_user_id),
    service: ChatService = Depends(get_chat_service),
):
    try:
        return await service.attach_file(current_user_id, dto)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

