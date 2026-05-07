import math

import aiosqlite
from fastapi import APIRouter, Query

from config import settings

router = APIRouter(prefix="/api/v1/maps", tags=["maps"])


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return 2 * r * math.atan2(math.sqrt(a), math.sqrt(1 - a))


@router.get("/nearby-hospitals")
async def nearby_hospitals(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: int = Query(15000),
):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT id,hospital_name,address,lat,lng,is_emergency_ready,total_beds FROM hospitals WHERE lat IS NOT NULL AND lng IS NOT NULL"
        ) as cur:
            rows = await cur.fetchall()

    hospitals = []
    for row in rows:
        distance_km = _haversine_km(lat, lng, row["lat"], row["lng"])
        if distance_km * 1000 <= radius:
            hospitals.append(
                {
                    "placeId": row["id"],
                    "name": row["hospital_name"],
                    "address": row["address"] or "",
                    "location": {"lat": row["lat"], "lng": row["lng"]},
                    "distanceKm": round(distance_km, 2),
                    "etaMinutes": max(3, int((distance_km / 35) * 60)),
                    "hasEmergency": bool(row["is_emergency_ready"]),
                    "availableBeds": row["total_beds"] or 0,
                }
            )
    hospitals.sort(key=lambda h: h["distanceKm"])
    return {"hospitals": hospitals}
