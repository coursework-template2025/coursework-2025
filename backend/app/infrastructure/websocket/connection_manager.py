from collections import defaultdict
from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    """
    Infrastructure-level WebSocket connection manager.

    Хранит подключения по "каналам" (например, conversation:{id}) и user_id.
    Занимается только доставкой сообщений, без бизнес-логики.
    """

    def __init__(self) -> None:
        # channel -> user_id -> WebSocket
        self._channels: dict[str, dict[int, WebSocket]] = defaultdict(dict)

    async def connect(self, websocket: WebSocket, user_id: int, channel: str) -> None:
        await websocket.accept()
        self._channels[channel][user_id] = websocket

    def disconnect(self, user_id: int, channel: str) -> None:
        users = self._channels.get(channel)
        if not users:
            return
        users.pop(user_id, None)
        if not users:
            self._channels.pop(channel, None)

    async def send_to_user(self, channel: str, user_id: int, message: Any) -> None:
        ws = self._channels.get(channel, {}).get(user_id)
        if ws is not None:
            await ws.send_json(message)

    async def broadcast(self, channel: str, message: Any, exclude_user_id: int | None = None) -> None:
        users = self._channels.get(channel, {})
        for uid, ws in list(users.items()):
            if exclude_user_id is not None and uid == exclude_user_id:
                continue
            try:
                await ws.send_json(message)
            except Exception as e:
                # best-effort: отваливаем невалидные подключения
                self.disconnect(uid, channel)


manager = ConnectionManager()