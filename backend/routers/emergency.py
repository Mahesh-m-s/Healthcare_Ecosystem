from fastapi import APIRouter, Depends, HTTPException
import aiosqlite
from config import settings
from auth.permissions import get_patient, get_hospital, get_current_user
from models.emergency_models import (
    SOSRequest, EmergencyResponse, AcceptEmergency, AmbulanceLocationUpdate,
)
from services.emergency.emergency_orchestrator import create_emergency, accept_emergency
from services.emergency.ambulance_service import update_ambulance_location, get_available_ambulances

router = APIRouter(prefix="/api/v1/emergency", tags=["emergency"])


async def _get_patient_id(user_id: str) -> str:
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT id FROM patients WHERE id=?", (user_id,)) as cur:
            row = await cur.fetchone()
    if not row:
        raise HTTPException(404, "Patient profile not found")
    return row["id"]


@router.post("/sos")
async def trigger_sos(req: SOSRequest, user: dict = Depends(get_patient)):
    patient_id = await _get_patient_id(user["id"])
    result = await create_emergency(
        patient_id=patient_id,
        lat=req.latitude,
        lng=req.longitude,
        description=req.description or "SOS triggered",
        severity=req.severity,
    )
    return result


@router.post("/trigger")
async def trigger_alias(req: dict, user: dict = Depends(get_patient)):
    sos = SOSRequest(
        latitude=req.get("latitude"),
        longitude=req.get("longitude"),
        description=req.get("reason") or req.get("description") or "SOS triggered",
        severity=req.get("severity") or "HIGH",
    )
    result = await trigger_sos(sos, user)
    return {"emergency": result}


@router.post("/accept")
async def accept(req: AcceptEmergency, user: dict = Depends(get_hospital)):
    return await accept_emergency(req.emergency_id, user["id"], req.ambulance_id)


@router.get("/list")
async def list_emergencies(status: str = None, user: dict = Depends(get_hospital)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        q = "SELECT * FROM emergencies WHERE 1=1"
        p = []
        if status:
            q += " AND status=?"
            p.append(status)
        q += " ORDER BY created_at DESC LIMIT 100"
        async with db.execute(q, p) as cur:
            rows = await cur.fetchall()
    return [dict(r) for r in rows]


@router.post("/ambulance/location")
async def ambulance_location(data: AmbulanceLocationUpdate, user: dict = Depends(get_current_user)):
    await update_ambulance_location(
        data.ambulance_id, data.latitude, data.longitude,
        data.heading, data.speed_kmh,
    )
    return {"status": "ok"}


@router.get("/ambulances")
async def ambulances(user: dict = Depends(get_hospital)):
    return await get_available_ambulances(user["id"])
