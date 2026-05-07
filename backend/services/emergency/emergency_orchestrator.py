import json
import uuid
from datetime import datetime
import aiosqlite
from config import settings
from services.ai.emergency_triage import triage_emergency
from app_websockets.manager import ws_manager
from app_websockets.events import EMERGENCY_INCOMING, EMERGENCY_ACCEPTED, EMERGENCY_STATUS_UPDATE


async def create_emergency(patient_id: str, lat: float, lng: float,
                            description: str, severity: str) -> dict:
    triage = await triage_emergency(description or "Emergency SOS triggered")
    emergency_id = str(uuid.uuid4())
    now          = datetime.utcnow().isoformat()
    severity     = triage.get("severity", severity)
    score        = triage.get("triage_score", 3)

    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        await db.execute(
            """INSERT INTO emergencies
               (id, patient_id, hospital_id, ambulance_id, status, lat, lng, eta_minutes, ai_triage, triggered_at)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (emergency_id, patient_id, None, None, "triggered", lat, lng, 12, json.dumps(triage), now),
        )
        await db.commit()

    payload = {
        "id": emergency_id, "patientId": patient_id,
        "lat": lat, "lng": lng, "severity": severity,
        "triageScore": score, "description": description,
        "triggeredAt": now, "status": "INITIATED",
    }
    # Notify all hospital managers
    await ws_manager.broadcast_to_role("hospital", EMERGENCY_INCOMING, payload)
    return payload


async def accept_emergency(emergency_id: str, hospital_id: str,
                            ambulance_id: str = None) -> dict:
    now = datetime.utcnow().isoformat()
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        await db.execute(
            "UPDATE emergencies SET status='accepted', hospital_id=?, ambulance_id=? WHERE id=?",
            (hospital_id, ambulance_id, emergency_id),
        )
        if ambulance_id:
            await db.execute(
                "UPDATE ambulances SET status='dispatched' WHERE id=?", (ambulance_id,)
            )
        await db.commit()
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM emergencies WHERE id=?", (emergency_id,)) as cur:
            row = dict(await cur.fetchone())

    await ws_manager.send_to_user(row["patient_id"], EMERGENCY_ACCEPTED, {
        "emergencyId": emergency_id, "hospitalId": hospital_id,
        "ambulanceId": ambulance_id, "status": "accepted",
    })
    return row
