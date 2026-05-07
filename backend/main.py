"""VaidyaAstra FastAPI Application"""
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from config import settings
from database.sqlite import init_db
from app_websockets.manager import ws_manager
from auth.jwt_handler import verify_token

# Routers
from routers import auth, patients, hospitals, doctors, emergency, ai_services, reports, maps

# Background tasks
from background_tasks.cleanup_worker import run_cleanup_loop
from background_tasks.notification_worker import run_reminder_loop


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    # Initialize SQLite schema
    await init_db()
    # Start background workers
    asyncio.create_task(run_cleanup_loop())
    asyncio.create_task(run_reminder_loop())
    print(f"[OK] VaidyaAstra backend started (debug={settings.debug})")
    yield
    print("[STOP] VaidyaAstra backend stopped")


app = FastAPI(
    title="VaidyaAstra API",
    description="AI-powered healthcare platform — patient portal, hospital dashboard, doctor tools",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS ──────────────────────────────────────────────────────────────────
origins = [o.strip() for o in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static file serving for uploads ──────────────────────────────────────
upload_dir = Path(settings.upload_dir)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")

# ─── API Routers ───────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(hospitals.router)
app.include_router(doctors.router)
app.include_router(emergency.router)
app.include_router(ai_services.router)
app.include_router(reports.router)
app.include_router(maps.router)


# ─── WebSocket endpoint ────────────────────────────────────────────────────
@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
):
    payload = verify_token(token)
    if not payload:
        await websocket.close(code=4001)
        return
    user_id = payload.get("sub")
    role    = payload.get("role", "patient")
    await ws_manager.connect(websocket, user_id, role)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back for ping/keep-alive
            await websocket.send_text(data)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, user_id, role)


# ─── Health check ──────────────────────────────────────────────────────────
@app.get("/health", tags=["system"])
async def health():
    return {
        "status": "ok",
        "app": settings.app_name,
        "ws_connections": ws_manager.active_count(),
    }


@app.get("/", tags=["system"])
async def root():
    return {"message": f"Welcome to {settings.app_name} API", "docs": "/docs"}
