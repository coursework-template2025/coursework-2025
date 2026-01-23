from datetime import timedelta

from fastapi import Header, HTTPException, WebSocket, Depends, Request
from sqlalchemy.util import await_only

from app.application.settings import settings
from jose import JWTError, jwt
import logging
from authx import AuthX, AuthXConfig

config = AuthXConfig()
config.JWT_SECRET_KEY = settings.jwt_secret
config.JWT_TOKEN_LOCATION = ["cookies", "headers"]
config.JWT_COOKIE_CSRF_PROTECT = False
config.JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

security = AuthX(config)


logger = logging.getLogger("uvicorn.error")

ALGORITHM = "HS256"

def get_user_id_from_jwt(token: str) -> int:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise ValueError("Invalid token")
        return int(user_id)
    except JWTError as e:
        logger.error(e)
        logger.error(f"Token: {token}")
        raise ValueError("Could not validate credentials")

async def get_current_user_id(
    request: Request,
    _: None = Depends(security.access_token_required),
) -> int:
    token = await security.get_access_token_from_request(request)
    try:
        if token.token is None:
            raise HTTPException(status_code=401,
                                detail="Unauthorized",
                                headers={"Authorization": "Bearer"},)
        user_id = get_user_id_from_jwt(token.token)
        return user_id
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=e.__str__(),
            headers={"Authorization": "Bearer"},
        )

def _get_user_id_from_ws(websocket: WebSocket) -> int:
    """
    Простая авторизация для WS: читаем Authorization из заголовков (как и в REST).
    """
    token = websocket.query_params.get("Authorization")
    if not token:
        raise ValueError("Missing Authorization header")
    try:
        user_id = get_user_id_from_jwt(token)
        return user_id
    except Exception as exc:
        raise ValueError(exc.__str__()) from exc
