import uuid
from datetime import datetime

import aiosqlite
from fastapi import APIRouter, Depends, HTTPException

from auth.permissions import get_hospital
from config import settings

router = APIRouter(prefix="/api/v1/hospitals", tags=["hospitals"])


async def _get_hospital_row(db, user_id: str):
    db.row_factory = aiosqlite.Row
    async with db.execute("SELECT * FROM hospitals WHERE id=?", (user_id,)) as cur:
        return await cur.fetchone()


@router.get("/profile")
async def get_profile(user: dict = Depends(get_hospital)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        row = await _get_hospital_row(db, user["id"])
    if not row:
        raise HTTPException(404, "Hospital profile not found")
    return dict(row)


@router.get("/dashboard")
async def dashboard(user: dict = Depends(get_hospital)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        hosp = await _get_hospital_row(db, user["id"])
        if not hosp:
            raise HTTPException(404, "Hospital not found")
        hid = hosp["id"]

        async with db.execute(
            "SELECT COUNT(*) as t, SUM(status='available') as a, SUM(status='occupied') as o,"
            " SUM(bed_type='icu') as it, SUM(bed_type='icu' AND status='available') as ia"
            " FROM beds WHERE hospital_id=?", (hid,)
        ) as cur:
            bs = dict(await cur.fetchone())

        async with db.execute(
            "SELECT COUNT(*) as c FROM emergencies WHERE hospital_id=? AND status NOT IN ('resolved','cancelled')",
            (hid,)
        ) as cur:
            active_em = (await cur.fetchone())["c"]

        today = datetime.utcnow().date().isoformat()
        async with db.execute(
            "SELECT COUNT(*) as c FROM appointments WHERE appointment_date=? AND status='confirmed'",
            (today,)
        ) as cur:
            today_adm = (await cur.fetchone())["c"]

    return {
        "totalBeds": bs["t"] or 0,
        "availableBeds": bs["a"] or 0,
        "occupiedBeds": bs["o"] or 0,
        "icuTotal": bs["it"] or 0,
        "icuAvailable": bs["ia"] or 0,
        "activePatients": bs["o"] or 0,
        "todayAdmissions": today_adm or 0,
        "emergencyAlertsToday": active_em or 0,
        "avgResponseTimeMinutes": 8,
    }


@router.get("/beds")
async def list_beds(user: dict = Depends(get_hospital)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        hosp = await _get_hospital_row(db, user["id"])
        if not hosp:
            raise HTTPException(404, "Hospital not found")
        async with db.execute(
            "SELECT * FROM beds WHERE hospital_id=? ORDER BY ward, bed_number", (hosp["id"],)
        ) as cur:
            rows = await cur.fetchall()
    beds = []
    for r in rows:
        beds.append(
            {
                "id": r["id"],
                "hospitalId": r["hospital_id"],
                "wardName": r["ward"],
                "bedNumber": r["bed_number"],
                "bedType": (r["bed_type"] or "general").lower(),
                "status": r["status"],
                "patientId": r["patient_id"],
                "patientName": r["patient_name"],
            }
        )
    return {"beds": beds}


@router.post("/beds", status_code=201)
async def add_bed(data: dict, user: dict = Depends(get_hospital)):
    bed_id = str(uuid.uuid4())
    now    = datetime.utcnow().isoformat()
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        hosp = await _get_hospital_row(db, user["id"])
        await db.execute(
            "INSERT INTO beds (id,hospital_id,ward,bed_number,status,bed_type,patient_id,updated_at) VALUES (?,?,?,?,?,?,?,?)",
            (
                bed_id,
                hosp["id"],
                data.get("wardName") or data.get("ward", "General"),
                data.get("bedNumber") or data.get("bed_number"),
                data.get("status", "available"),
                data.get("bedType") or data.get("bed_type", "general"),
                data.get("patientId") or data.get("patient_id"),
                data.get("patientName"),
            ),
        )
        await db.commit()
        async with db.execute("SELECT * FROM beds WHERE id=?", (bed_id,)) as cur:
            row = await cur.fetchone()
    return dict(row)


@router.put("/beds/{bed_id}")
async def update_bed(bed_id: str, data: dict, user: dict = Depends(get_hospital)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        hosp = await _get_hospital_row(db, user["id"])
        status = data.get("status", "available")
        await db.execute(
            "UPDATE beds SET status=? WHERE id=? AND hospital_id=?",
            (status, bed_id, hosp["id"]),
        )
        await db.commit()
        async with db.execute("SELECT * FROM beds WHERE id=?", (bed_id,)) as cur:
            row = await cur.fetchone()
    if not row:
        raise HTTPException(404, "Bed not found")
    return {
        "id": row["id"],
        "status": row["status"],
    }


@router.get("/emergency-alerts")
async def list_emergencies(status: str = None, user: dict = Depends(get_hospital)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        hosp = await _get_hospital_row(db, user["id"])
        query = "SELECT * FROM emergencies WHERE hospital_id=? OR hospital_id IS NULL"
        params = [hosp["id"]]
        if status:
            query += " AND status=?"
            params.append(status)
        query += " ORDER BY created_at DESC"
        async with db.execute(query, params) as cur:
            rows = await cur.fetchall()
    alerts = []
    for r in rows:
        alerts.append(
            {
                "id": r["id"],
                "emergencyId": r["id"],
                "patientName": "Unknown Patient",
                "patientAge": 0,
                "bloodGroup": "Unknown",
                "allergies": [],
                "aiTriageColor": "RED",
                "probableCondition": "Emergency",
                "criticalInfo": "Immediate attention required",
                "etaMinutes": r["eta_minutes"] or 10,
                "patientLat": r["lat"] or 0,
                "patientLng": r["lng"] or 0,
                "receivedAt": r["triggered_at"],
                "status": "pending" if r["status"] == "triggered" else r["status"],
            }
        )
    return {"alerts": alerts}


@router.post("/emergency-alerts/{alert_id}/accept")
async def accept_alert(alert_id: str, payload: dict, user: dict = Depends(get_hospital)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        await db.execute(
            "UPDATE emergencies SET status='accepted', hospital_id=? WHERE id=?",
            (user["id"], payload.get("emergencyId") or alert_id),
        )
        await db.commit()
    return {"message": "Emergency accepted"}


@router.get("/doctors")
async def hospital_doctors(user: dict = Depends(get_hospital)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            """SELECT d.id,d.specialization,d.phone,d.is_available,d.experience_years,u.name,u.email
               FROM doctors d JOIN users u ON d.id=u.id WHERE d.hospital_id=?""",
            (user["id"],),
        ) as cur:
            rows = await cur.fetchall()
    doctors = []
    for r in rows:
        doctors.append(
            {
                "id": r["id"],
                "fullName": r["name"],
                "email": r["email"],
                "phone": r["phone"] or "",
                "role": "doctor",
                "hospitalId": user["id"],
                "specialization": r["specialization"] or "",
                "licenseNumber": "",
                "isAvailable": bool(r["is_available"]),
                "isVerified": True,
                "createdAt": datetime.utcnow().isoformat(),
            }
        )
    return {"doctors": doctors}


@router.get("/ambulances")
async def hospital_ambulances(user: dict = Depends(get_hospital)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM ambulances WHERE hospital_id=?", (user["id"],)) as cur:
            rows = await cur.fetchall()
    ambulances = []
    for r in rows:
        ambulances.append(
            {
                "id": r["id"],
                "hospitalId": r["hospital_id"],
                "unitNumber": r["vehicle_number"],
                "driverName": r["driver_name"],
                "driverPhone": r["driver_phone"],
                "currentLat": r["lat"],
                "currentLng": r["lng"],
                "status": r["status"],
            }
        )
    return {"ambulances": ambulances}


# Public endpoint: list hospitals for patient hospital-finder
@router.get("/public/list")
async def public_hospital_list(city: str = None):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        q = "SELECT id,hospital_name,address,phone,lat,lng,total_beds,is_emergency_ready FROM hospitals"
        p = []
        async with db.execute(q, p) as cur:
            rows = await cur.fetchall()
    return {"hospitals": [dict(r) for r in rows]}
