import uuid
from datetime import datetime
import aiosqlite
from config import settings
from services.files.storage_service import save_file, get_file_path, delete_file
from services.files.pdf_extractor import extract_text
from services.ai.report_analyzer import analyze_report_text


async def upload_medical_file(
    file_bytes: bytes,
    original_filename: str,
    patient_id: str,
    report_type: str,
) -> dict:
    stored_name, rel_path = save_file(file_bytes, original_filename, patient_id)
    file_ext  = original_filename.rsplit(".", 1)[-1].lower()
    file_size = len(file_bytes)
    record_id = str(uuid.uuid4())
    now       = datetime.utcnow().isoformat()

    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        await db.execute(
            """INSERT INTO medical_files
               (id, patient_id, original_name, stored_name, file_path, file_size, mime_type, report_type, uploaded_at)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (record_id, patient_id, original_filename, stored_name, rel_path, file_size, file_ext, report_type, now),
        )
        await db.commit()

    return {
        "id": record_id,
        "fileUuid": record_id,
        "originalName": original_filename,
        "fileName": stored_name,
        "mimeType": file_ext,
        "reportType": report_type,
        "fileSize": file_size,
        "filePath": rel_path,
        "uploadDate": now,
        "message": "File uploaded successfully",
    }


async def run_ai_analysis_on_file(file_id: str, patient_id: str) -> dict:
    """Extract text and run Gemini analysis; updates DB with results."""
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        query = "SELECT * FROM medical_files WHERE id=?"
        params = [file_id]
        if patient_id:
            query += " AND patient_id=?"
            params.append(patient_id)
        async with db.execute(query, params) as cur:
            row = await cur.fetchone()
        if not row:
            return {}
        row = dict(row)

    abs_path  = str(get_file_path(row["file_path"]))
    text      = extract_text(abs_path)
    analysis  = await analyze_report_text(text or "Unable to extract text", row["report_type"])

    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        await db.execute(
            "UPDATE medical_files SET ai_summary=?, risk_level=? WHERE id=?",
            (analysis.get("summary"), analysis.get("risk_level"), file_id),
        )
        await db.commit()

    return analysis
