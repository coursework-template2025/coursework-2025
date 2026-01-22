from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.util import await_only
from starlette.responses import HTMLResponse

from app.application.dto import user_dto
from app.application.security import password_hasher
from app.application.services.user_service import UserService
from app.presentation.dependencies.auth import get_current_user_id, security, config
from app.presentation.dependencies.services import get_chat_service, get_user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register/")
async def register_user(
        dto: user_dto.UserRegisterDTO,
        service: UserService = Depends(get_user_service),
):
    await service.register(dto)
    await service.session.commit()
    return {"user": 1}

@router.post("/login/")
async def login_user(
        dto: user_dto.UserLoginDTO,
        response: Response,
        service: UserService = Depends(get_user_service),
):
    user = await service.user_repo.get_user_by_username_email(dto.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    verify = service.password_hasher.verify(dto.password, user.password)
    if not verify:
        raise HTTPException(status_code=404, detail="Incorrect password")
    token = security.create_access_token(uid=str(user.id))
    response.set_cookie(config.JWT_ACCESS_COOKIE_NAME, token)
    return {"token": token}

@router.get("/",
            dependencies=[Depends(security.access_token_required)],
            response_model=List[user_dto.UserReadDTO])
async def get_users(
        username: str,
        service: UserService = Depends(get_user_service)):
    users = await service.get_users_by_username_email(username)
    return users

@router.get("/me/",
            response_model=user_dto.UserReadDTO)
async def get_me(
        current_user_id: str = Depends(get_current_user_id),
        service: UserService = Depends(get_user_service)):
    user = await service.user_repo.get_user_by_id(current_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user