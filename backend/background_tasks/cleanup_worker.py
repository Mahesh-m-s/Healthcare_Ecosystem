"""Periodic DB cleanup: expired tokens, stale sessions."""
import asyncio
from datetime import datetime, timedelta
import aiosqlite
from config import settings


async def cleanup_expired_tokens():
    cutoff = (datetime.utcnow() - timedelta(days=7)).isoformat()
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        await db.execute("DELETE FROM refresh_tokens WHERE expires_at < ?", (cutoff,))
        await db.commit()


async def run_cleanup_loop(interval_seconds: int = 3600):
    while True:
        await asyncio.sleep(interval_seconds)
        await cleanup_expired_tokens()
