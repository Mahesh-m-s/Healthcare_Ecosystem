from pydantic_settings import BaseSettings
from pathlib import Path
from functools import lru_cache


class Settings(BaseSettings):
    # ─── Security ─────────────────────────────────────────────────────────
    secret_key:     str = "changeme-set-in-env"
    jwt_secret_key: str = "changeme-set-in-env"

    # ─── AI ───────────────────────────────────────────────────────────────
    gemini_api_key: str = ""

    # ─── Maps ─────────────────────────────────────────────────────────────
    google_maps_api_key: str = ""

    # ─── Databases ────────────────────────────────────────────────────────
    sqlite_db_path: str = "./data/vaidyaastra.db"

    # ─── File Storage (local only) ────────────────────────────────────────
    upload_dir: str = "./data/uploads"

    # ─── SMTP (optional — local relay) ────────────────────────────────────
    smtp_host:     str = ""
    smtp_port:     int = 465
    smtp_user:     str = ""
    smtp_password: str = ""
    smtp_from:     str = "noreply@vaidyaastra.local"

    # ─── App ──────────────────────────────────────────────────────────────
    app_name:    str = "VaidyaAstra"
    debug:       bool = False
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra    = "ignore"


settings = Settings()


@lru_cache
def get_settings() -> Settings:
    return settings

# Ensure data directories exist
from pathlib import Path
Path(settings.sqlite_db_path).parent.mkdir(parents=True, exist_ok=True)
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
