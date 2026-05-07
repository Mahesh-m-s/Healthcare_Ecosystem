import uuid
from datetime import datetime

import aiosqlite
from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile

from auth.permissions import get_patient
from background_tasks.ai_analysis_worker import process_file_analysis
from config import settings
from services.files.file_service import upload_medical_file

router = APIRouter(prefix="/api/v1/patients", tags=["patients"])


async def _get_patient_row(db, user_id: str):
    db.row_factory = aiosqlite.Row
    async with db.execute("SELECT * FROM patients WHERE id=?", (user_id,)) as cur:
        return await cur.fetchone()


@router.get("/profile")
async def get_profile(user: dict = Depends(get_patient)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        row = await _get_patient_row(db, user["id"])
    if not row:
        raise HTTPException(404, "Patient profile not found")
    return dict(row)


@router.put("/profile")
async def update_profile(data: dict, user: dict = Depends(get_patient)):
    updates = {k: v for k, v in data.items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")
    set_clause = ", ".join(f"{k}=?" for k in updates)
    values     = list(updates.values())
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        row = await _get_patient_row(db, user["id"])
        if not row:
            raise HTTPException(404, "Profile not found")
        await db.execute(f"UPDATE patients SET {set_clause} WHERE id=?",
                         values + [user["id"]])
        await db.commit()
        row = await _get_patient_row(db, user["id"])
    return dict(row)


# ─── Medical Vault ─────────────────────────────────────────────────────────
@router.get("/vault")
async def list_vault(user: dict = Depends(get_patient)):
    files = await list_files(user)
    return {"files": files}


@router.get("/files")
async def list_files(user: dict = Depends(get_patient)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        row = await _get_patient_row(db, user["id"])
        if not row:
            return []
        async with db.execute(
            "SELECT * FROM medical_files WHERE patient_id=? ORDER BY uploaded_at DESC",
            (row["id"],),
        ) as cur:
            rows = await cur.fetchall()
    out = []
    for r in rows:
        out.append(
            {
                "id": r["id"],
                "fileUuid": r["id"],
                "patientId": r["patient_id"],
                "fileName": r["stored_name"],
                "originalName": r["original_name"],
                "fileSize": r["file_size"],
                "reportType": r["report_type"],
                "mimeType": r["mime_type"],
                "filePath": r["file_path"],
                "uploadDate": r["uploaded_at"],
                "analysisStatus": "completed" if r.get("ai_summary") else "pending",
            }
        )
    return out


@router.post("/vault/upload", status_code=201)
async def upload_vault_file(
    bg: BackgroundTasks,
    file: UploadFile = File(...),
    report_type: str = "general",
    user: dict = Depends(get_patient),
):
    result = await upload_file(bg=bg, file=file, report_type=report_type, user=user)
    return {"file": result}


@router.post("/files", status_code=201)
async def upload_file(
    bg: BackgroundTasks,
    file: UploadFile = File(...),
    report_type: str = "general",
    user: dict = Depends(get_patient),
):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        row = await _get_patient_row(db, user["id"])
    if not row:
        raise HTTPException(404, "Patient not found")
    content = await file.read()
    result  = await upload_medical_file(content, file.filename, row["id"], report_type)
    bg.add_task(process_file_analysis, result["id"], row["id"])
    return result


@router.delete("/files/{file_id}")
async def delete_file(file_id: str, user: dict = Depends(get_patient)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        row = await _get_patient_row(db, user["id"])
        async with db.execute(
            "SELECT * FROM medical_files WHERE id=? AND patient_id=?", (file_id, row["id"])
        ) as cur:
            f = await cur.fetchone()
        if not f:
            raise HTTPException(404, "File not found")
        from services.files.storage_service import delete_file as del_f
        del_f(f["file_path"])
        await db.execute("DELETE FROM medical_files WHERE id=?", (file_id,))
        await db.commit()
    return {"message": "File deleted"}


# ─── Emergency Contacts ────────────────────────────────────────────────────
@router.get("/emergency-contacts")
async def list_emergency_contacts(user: dict = Depends(get_patient)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        row = await _get_patient_row(db, user["id"])
        async with db.execute(
            "SELECT * FROM emergency_contacts WHERE patient_id=?", (row["id"],)
        ) as cur:
            rows = await cur.fetchall()
    contacts = []
    for r in rows:
        contacts.append(
            {
                "id": r["id"],
                "patientId": r["patient_id"],
                "name": r["name"],
                "relation": r["relationship"],
                "phone": r["phone"],
                "priorityOrder": 1,
                "notifySms": True,
                "notifyEmail": False,
            }
        )
    return {"contacts": contacts}


@router.post("/emergency-contacts", status_code=201)
async def add_emergency_contact(data: dict, user: dict = Depends(get_patient)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        row = await _get_patient_row(db, user["id"])
        # Max 5
        async with db.execute("SELECT COUNT(*) FROM emergency_contacts WHERE patient_id=?",
                              (row["id"],)) as cur:
            cnt = (await cur.fetchone())[0]
        if cnt >= 5:
            raise HTTPException(400, "Maximum 5 emergency contacts allowed")
        ec_id = str(uuid.uuid4())
        await db.execute(
            "INSERT INTO emergency_contacts (id,patient_id,name,relationship,phone,is_primary) VALUES (?,?,?,?,?,?)",
            (ec_id, row["id"], data.get("name"), data.get("relation") or data.get("relationship"), data.get("phone"), 0),
        )
        await db.commit()
        async with db.execute("SELECT * FROM emergency_contacts WHERE id=?", (ec_id,)) as cur:
            new_row = await cur.fetchone()
    return {"contact": {
        "id": new_row["id"], "patientId": new_row["patient_id"], "name": new_row["name"],
        "relation": new_row["relationship"], "phone": new_row["phone"], "priorityOrder": 1,
        "notifySms": True, "notifyEmail": False,
    }}


@router.delete("/emergency-contacts/{ec_id}")
async def delete_emergency_contact(ec_id: str, user: dict = Depends(get_patient)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        row = await _get_patient_row(db, user["id"])
        async with db.execute(
            "SELECT id FROM emergency_contacts WHERE id=? AND patient_id=?", (ec_id, row["id"])
        ) as cur:
            if not await cur.fetchone():
                raise HTTPException(404, "Contact not found")
        await db.execute("DELETE FROM emergency_contacts WHERE id=?", (ec_id,))
        await db.commit()
    return {"message": "Contact deleted"}


# ─── Appointments ──────────────────────────────────────────────────────────
@router.get("/appointments")
async def list_appointments(user: dict = Depends(get_patient)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        row = await _get_patient_row(db, user["id"])
        async with db.execute(
            """SELECT a.id,a.patient_id,a.doctor_id,a.hospital_id,a.appointment_time,a.type,a.status,a.notes,a.created_at,
               u.name as doctor_name
               FROM appointments a
               LEFT JOIN users u ON a.doctor_id=u.id
               WHERE a.patient_id=? ORDER BY a.created_at DESC""",
            (row["id"],),
        ) as cur:
            rows = await cur.fetchall()
    appointments = []
    for r in rows:
        appointments.append(
            {
                "id": r["id"],
                "patientId": r["patient_id"],
                "doctorId": r["doctor_id"],
                "hospitalId": r["hospital_id"],
                "appointmentTime": r["appointment_time"],
                "type": r["type"],
                "status": r["status"],
                "notes": r["notes"],
                "createdAt": r["created_at"],
                "doctorName": r["doctor_name"],
            }
        )
    return {"appointments": appointments}


@router.post("/appointments", status_code=201)
async def book_appointment(data: dict, user: dict = Depends(get_patient)):
    appt_id = str(uuid.uuid4())
    now     = datetime.utcnow().isoformat()
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        row = await _get_patient_row(db, user["id"])
        await db.execute(
            """INSERT INTO appointments
               (id,patient_id,doctor_id,hospital_id,appointment_time,type,status,reason,notes,created_at)
               VALUES (?,?,?,?,?,?, 'scheduled',?,?,?)""",
            (appt_id, row["id"], data.get("doctorId"), data.get("hospitalId"), data.get("appointmentTime", now),
             data.get("type", "opd"), data.get("reason"), data.get("notes"), now),
        )
        await db.commit()
        async with db.execute("SELECT * FROM appointments WHERE id=?", (appt_id,)) as cur:
            new_row = await cur.fetchone()
    return dict(new_row)


@router.get("/vault/{file_id}/analysis")
async def file_analysis(file_id: str, user: dict = Depends(get_patient)):
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM medical_files WHERE id=? AND patient_id=?",
            (file_id, user["id"]),
        ) as cur:
            row = await cur.fetchone()
    if not row:
        raise HTTPException(404, "Analysis not found")
    return {
        "analysisUuid": row["id"],
        "fileUuid": row["id"],
        "patientId": row["patient_id"],
        "status": "completed" if row.get("ai_summary") else "pending",
        "result": {
            "summary": row.get("ai_summary") or "Analysis in progress",
            "riskLevel": row.get("risk_level") or "MEDIUM",
            "findings": [],
            "nextSteps": [],
        },
        "createdAt": row["uploaded_at"],
    }
