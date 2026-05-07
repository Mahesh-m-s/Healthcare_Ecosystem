from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
import aiosqlite
from config import settings
from auth.permissions import get_current_user
from services.files.storage_service import get_file_path

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])


@router.get("/{file_id}/download")
async def download_file(file_id: str, user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM medical_files WHERE id=?", (file_id,)) as cur:
            row = await cur.fetchone()
    if not row:
        raise HTTPException(404, "File not found")
    path = get_file_path(row["file_path"])
    if not path.exists():
        raise HTTPException(404, "File missing on disk")
    return FileResponse(
        path=str(path),
        filename=row["file_name"],
        media_type="application/octet-stream",
    )


@router.get("/{file_id}/analysis")
async def get_analysis(file_id: str, user: dict = Depends(get_current_user)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM medical_files WHERE id=?", (file_id,)) as cur:
            row = await cur.fetchone()
    if not row:
        raise HTTPException(404, "File not found")
    return {
        "file_id":    file_id,
        "ai_summary": row["ai_summary"],
        "risk_level": row["risk_level"],
        "file_name":  row["file_name"],
        "report_type": row["report_type"],
    }
