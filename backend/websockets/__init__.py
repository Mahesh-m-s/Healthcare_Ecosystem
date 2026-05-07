"""
Prevent local package shadowing third-party `websockets`.

Uvicorn imports `websockets` for protocol handling. This project keeps
application helpers under `app_websockets` instead.
"""

raise ImportError("Use app_websockets package for app websocket helpers.")
