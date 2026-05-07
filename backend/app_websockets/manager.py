import json
from typing import Dict, List

from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections grouped by user_id and role."""

    def __init__(self):
        # user_id -> list of active websockets
        self._connections: Dict[str, List[WebSocket]] = {}
        # role -> set of user_ids
        self._roles: Dict[str, set] = {}

    async def connect(self, websocket: WebSocket, user_id: str, role: str):
        await websocket.accept()
        self._connections.setdefault(user_id, []).append(websocket)
        self._roles.setdefault(role, set()).add(user_id)

    def disconnect(self, websocket: WebSocket, user_id: str, role: str):
        conns = self._connections.get(user_id, [])
        if websocket in conns:
            conns.remove(websocket)
        if not conns:
            self._connections.pop(user_id, None)
            self._roles.get(role, set()).discard(user_id)

    async def send_to_user(self, user_id: str, event: str, data: dict):
        payload = json.dumps({"event": event, "data": data})
        for ws in list(self._connections.get(user_id, [])):
            try:
                await ws.send_text(payload)
            except Exception:
                pass

    async def broadcast_to_role(self, role: str, event: str, data: dict):
        payload = json.dumps({"event": event, "data": data})
        for uid in list(self._roles.get(role, set())):
            for ws in list(self._connections.get(uid, [])):
                try:
                    await ws.send_text(payload)
                except Exception:
                    pass

    async def broadcast_all(self, event: str, data: dict):
        payload = json.dumps({"event": event, "data": data})
        for _, conns in list(self._connections.items()):
            for ws in list(conns):
                try:
                    await ws.send_text(payload)
                except Exception:
                    pass

    def active_count(self) -> int:
        return sum(len(v) for v in self._connections.values())


ws_manager = ConnectionManager()
