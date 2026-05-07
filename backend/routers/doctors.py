import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
import aiosqlite
from config import settings
from auth.permissions import get_doctor
import json

router = APIRouter(prefix="/api/v1/doctors", tags=["doctors"])


async def _get_doctor_row(db, user_id: str):
    db.row_factory = aiosqlite.Row
    async with db.execute("SELECT * FROM doctors WHERE id=?", (user_id,)) as cur:
        return await cur.fetchone()


@router.get("/profile")
async def get_profile(user: dict = Depends(get_doctor)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        doc = await _get_doctor_row(db, user["id"])
        if not doc:
            raise HTTPException(404, "Doctor profile not found")
        doc = dict(doc)
        if doc.get("hospital_id"):
            async with db.execute("SELECT hospital_name FROM hospitals WHERE id=?",
                                  (doc["hospital_id"],)) as cur:
                h = await cur.fetchone()
                doc["hospital_name"] = h[0] if h else None
    return doc


@router.put("/availability")
async def set_availability(data: dict, user: dict = Depends(get_doctor)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        is_available = bool(data.get("is_available", data.get("isAvailable", True)))
        await db.execute("UPDATE doctors SET is_available=? WHERE id=?",
                         (int(is_available), user["id"]))
        await db.commit()
    return {"is_available": is_available}


@router.get("/patients")
async def my_patients(user: dict = Depends(get_doctor)):
    """Returns all patients that have appointments with this doctor."""
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        doc = await _get_doctor_row(db, user["id"])
        if not doc:
            raise HTTPException(404, "Doctor not found")
        async with db.execute(
            """SELECT DISTINCT p.* FROM patients p
               JOIN appointments a ON a.patient_id=p.id
               WHERE a.doctor_id=?""", (doc["id"],)
        ) as cur:
            rows = await cur.fetchall()
    return {"patients": [dict(r) for r in rows]}


# ─── SOAP Notes ────────────────────────────────────────────────────────────
@router.post("/patients/{patient_id}/notes", status_code=201)
async def create_soap(patient_id: str, data: dict, user: dict = Depends(get_doctor)):
    note_id = str(uuid.uuid4())
    now     = datetime.utcnow().isoformat()
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        doc = await _get_doctor_row(db, user["id"])
        await db.execute(
            """INSERT INTO soap_notes
               (id,doctor_id,patient_id,subjective,objective,assessment,plan,visit_type,created_at)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (note_id, doc["id"], patient_id, data.get("subjective"), data.get("objective"),
             data.get("assessment"), data.get("plan"), data.get("visitType", "Follow-up"), now),
        )
        await db.commit()
        async with db.execute("SELECT * FROM soap_notes WHERE id=?", (note_id,)) as cur:
            row = await cur.fetchone()
    return {"note": dict(row)}


@router.get("/patients/{patient_id}/notes")
async def get_soap_notes(patient_id: str, user: dict = Depends(get_doctor)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        doc = await _get_doctor_row(db, user["id"])
        async with db.execute(
            "SELECT * FROM soap_notes WHERE doctor_id=? AND patient_id=? ORDER BY created_at DESC",
            (doc["id"], patient_id),
        ) as cur:
            rows = await cur.fetchall()
    return {"notes": [dict(r) for r in rows]}


# ─── Prescriptions ─────────────────────────────────────────────────────────
@router.post("/patients/{patient_id}/prescription", status_code=201)
async def write_prescription(patient_id: str, data: dict, user: dict = Depends(get_doctor)):
    rx_id = str(uuid.uuid4())
    now   = datetime.utcnow().isoformat()
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        doc = await _get_doctor_row(db, user["id"])
        await db.execute(
            """INSERT INTO prescriptions
               (id,doctor_id,patient_id,medications,diagnosis,notes,follow_up_date,is_active,created_at)
               VALUES (?,?,?,?,?,?,?,1,?)""",
            (rx_id, doc["id"], patient_id, json.dumps(data.get("medicines", data.get("medications", []))),
             data.get("diagnosis"), data.get("instructions", data.get("notes")), data.get("followUpDate"), now),
        )
        await db.commit()
        async with db.execute("SELECT * FROM prescriptions WHERE id=?", (rx_id,)) as cur:
            row = dict(await cur.fetchone())
    row["medications"] = json.loads(row["medications"])
    return {"prescription": row}


@router.get("/prescriptions/{patient_id}")
async def get_prescriptions(patient_id: str, user: dict = Depends(get_doctor)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        doc = await _get_doctor_row(db, user["id"])
        async with db.execute(
            "SELECT * FROM prescriptions WHERE doctor_id=? AND patient_id=? ORDER BY created_at DESC",
            (doc["id"], patient_id),
        ) as cur:
            rows = [dict(r) for r in await cur.fetchall()]
    for r in rows:
        r["medications"] = json.loads(r.get("medications") or "[]")
    return {"prescriptions": rows}


@router.get("/patients/{patient_id}")
async def get_patient(patient_id: str, user: dict = Depends(get_doctor)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            """SELECT p.*,u.name,u.email,u.role,u.created_at FROM patients p
               JOIN users u ON p.id=u.id WHERE p.id=?""",
            (patient_id,),
        ) as cur:
            row = await cur.fetchone()
    if not row:
        raise HTTPException(404, "Patient not found")
    return {"patient": dict(row)}


@router.get("/patients/{patient_id}/records")
async def patient_records(patient_id: str, user: dict = Depends(get_doctor)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM medical_files WHERE patient_id=? ORDER BY uploaded_at DESC",
            (patient_id,),
        ) as cur:
            rows = await cur.fetchall()
    files = []
    for r in rows:
        files.append(
            {
                "fileUuid": r["id"],
                "patientId": r["patient_id"],
                "fileName": r["stored_name"],
                "originalName": r["original_name"],
                "fileSize": r["file_size"],
                "reportType": r["report_type"],
                "uploadDate": r["uploaded_at"],
            }
        )
    return {"files": files}


# Public: list available doctors
@router.get("/public/list")
async def public_doctors(specialization: str = None, hospital_id: str = None):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        q = "SELECT id,full_name,specialization,hospital_id,years_experience,is_available FROM doctors WHERE is_available=1"
        p = []
        if specialization:
            q += " AND specialization LIKE ?"
            p.append(f"%{specialization}%")
        if hospital_id:
            q += " AND hospital_id=?"
            p.append(hospital_id)
        async with db.execute(q, p) as cur:
            rows = await cur.fetchall()
    return [dict(r) for r in rows]
