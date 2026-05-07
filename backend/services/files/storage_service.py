"""Local filesystem storage — no cloud dependencies."""
import os, shutil, uuid
from pathlib import Path
from config import settings

UPLOAD_DIR = Path(settings.upload_dir)
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".dcm"}
MAX_FILE_SIZE_MB = 50


def _ensure_dirs(patient_id: str) -> Path:
    p = UPLOAD_DIR / patient_id
    p.mkdir(parents=True, exist_ok=True)
    return p


def save_file(file_bytes: bytes, original_filename: str, patient_id: str) -> tuple[str, str]:
    """Save bytes to local storage. Returns (file_id, relative_path)."""
    ext = Path(original_filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File type {ext} not allowed")
    if len(file_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValueError(f"File exceeds {MAX_FILE_SIZE_MB}MB limit")
    directory = _ensure_dirs(patient_id)
    file_id   = str(uuid.uuid4())
    dest      = directory / f"{file_id}{ext}"
    with open(dest, "wb") as f:
        f.write(file_bytes)
    rel_path = str(dest.relative_to(UPLOAD_DIR))
    return file_id, rel_path


def get_file_path(relative_path: str) -> Path:
    return UPLOAD_DIR / relative_path


def delete_file(relative_path: str) -> bool:
    p = UPLOAD_DIR / relative_path
    if p.exists():
        p.unlink()
        return True
    return False
