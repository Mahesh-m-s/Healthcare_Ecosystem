"""Appointment reminder worker."""
import asyncio
from datetime import datetime, timedelta
import aiosqlite
from config import settings
from app_websockets.manager import ws_manager
from app_websockets.events import APPOINTMENT_REMINDER


async def send_appointment_reminders():
    tomorrow = (datetime.utcnow() + timedelta(days=1)).date().isoformat()
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM appointments WHERE appointment_date=? AND status='confirmed'",
            (tomorrow,),
        ) as cur:
            rows = [dict(r) for r in await cur.fetchall()]
    for appt in rows:
        await ws_manager.send_to_user(appt["patient_id"], APPOINTMENT_REMINDER, {
            "appointment_id":   appt["id"],
            "appointment_date": appt["appointment_date"],
            "appointment_time": appt["appointment_time"],
        })


async def run_reminder_loop(interval_seconds: int = 3600):
    while True:
        await asyncio.sleep(interval_seconds)
        await send_appointment_reminders()
