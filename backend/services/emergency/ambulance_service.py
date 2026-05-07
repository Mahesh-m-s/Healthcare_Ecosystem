import aiosqlite
from datetime import datetime
from config import settings
from app_websockets.manager import ws_manager
from app_websockets.events import AMBULANCE_LOCATION


async def update_ambulance_location(ambulance_id: str, lat: float, lng: float,
                                    heading: float = None, speed: float = None):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        await db.execute(
            "UPDATE ambulances SET lat=?, lng=?, last_updated=? WHERE id=?",
            (lat, lng, datetime.utcnow().isoformat(), ambulance_id),
        )
        await db.commit()

    # Broadcast location to all hospital staff
    await ws_manager.broadcast_to_role("hospital", AMBULANCE_LOCATION, {
        "ambulance_id": ambulance_id,
        "lat": lat, "lng": lng,
        "heading": heading, "speed": speed,
        "timestamp": datetime.utcnow().isoformat(),
    })


async def get_available_ambulances(hospital_id: str) -> list:
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM ambulances WHERE hospital_id=? AND status='available'",
            (hospital_id,),
        ) as cur:
            rows = await cur.fetchall()
    return [dict(r) for r in rows]
