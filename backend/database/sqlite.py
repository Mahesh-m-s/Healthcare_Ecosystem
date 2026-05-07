import aiosqlite
import os
from config import get_settings

settings = get_settings()

async def get_db():
    os.makedirs(os.path.dirname(settings.sqlite_db_path), exist_ok=True)
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        yield db

async def init_db():
    os.makedirs(os.path.dirname(settings.sqlite_db_path), exist_ok=True)
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        await db.execute("PRAGMA journal_mode=WAL")
        await db.execute("PRAGMA foreign_keys=ON")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('patient','doctor','hospital')),
            is_active INTEGER DEFAULT 1,
            is_verified INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            phone TEXT,
            date_of_birth TEXT,
            gender TEXT,
            blood_group TEXT,
            allergies TEXT DEFAULT '[]',
            chronic_conditions TEXT DEFAULT '[]',
            current_medications TEXT DEFAULT '[]',
            health_score INTEGER DEFAULT 85,
            created_at TEXT DEFAULT (datetime('now'))
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS hospitals (
            id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            hospital_name TEXT NOT NULL,
            address TEXT,
            phone TEXT,
            license_number TEXT,
            total_beds INTEGER DEFAULT 0,
            lat REAL,
            lng REAL,
            is_emergency_ready INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS doctors (
            id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            hospital_id TEXT REFERENCES hospitals(id),
            specialization TEXT,
            qualification TEXT,
            experience_years INTEGER DEFAULT 0,
            consultation_fee REAL DEFAULT 0,
            phone TEXT,
            is_available INTEGER DEFAULT 1,
            rating REAL DEFAULT 0,
            total_patients INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS medical_files (
            id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
            original_name TEXT NOT NULL,
            stored_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER,
            mime_type TEXT,
            report_type TEXT,
            uploaded_at TEXT DEFAULT (datetime('now'))
        )""")
        # Backward-compatible columns used by AI analysis workflow.
        async with db.execute("PRAGMA table_info(medical_files)") as cur:
            columns = {row[1] for row in await cur.fetchall()}
        if "ai_summary" not in columns:
            await db.execute("ALTER TABLE medical_files ADD COLUMN ai_summary TEXT")
        if "risk_level" not in columns:
            await db.execute("ALTER TABLE medical_files ADD COLUMN risk_level TEXT")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
            doctor_id TEXT REFERENCES doctors(id),
            hospital_id TEXT REFERENCES hospitals(id),
            appointment_time TEXT NOT NULL,
            duration_minutes INTEGER DEFAULT 30,
            type TEXT DEFAULT 'in-person',
            status TEXT DEFAULT 'scheduled',
            reason TEXT,
            notes TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS emergencies (
            id TEXT PRIMARY KEY,
            patient_id TEXT REFERENCES patients(id),
            hospital_id TEXT REFERENCES hospitals(id),
            ambulance_id TEXT,
            status TEXT DEFAULT 'triggered',
            lat REAL,
            lng REAL,
            eta_minutes INTEGER,
            ai_triage TEXT DEFAULT '{}',
            triggered_at TEXT DEFAULT (datetime('now')),
            resolved_at TEXT
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS beds (
            id TEXT PRIMARY KEY,
            hospital_id TEXT REFERENCES hospitals(id) ON DELETE CASCADE,
            bed_number TEXT NOT NULL,
            ward TEXT NOT NULL,
            bed_type TEXT DEFAULT 'Standard',
            status TEXT DEFAULT 'available',
            patient_id TEXT REFERENCES patients(id),
            patient_name TEXT
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS ambulances (
            id TEXT PRIMARY KEY,
            hospital_id TEXT REFERENCES hospitals(id) ON DELETE CASCADE,
            vehicle_number TEXT NOT NULL,
            driver_name TEXT,
            driver_phone TEXT,
            status TEXT DEFAULT 'available',
            lat REAL,
            lng REAL,
            last_updated TEXT DEFAULT (datetime('now'))
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS soap_notes (
            id TEXT PRIMARY KEY,
            patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
            doctor_id TEXT REFERENCES doctors(id),
            visit_type TEXT DEFAULT 'Follow-up',
            subjective TEXT,
            objective TEXT,
            assessment TEXT,
            plan TEXT,
            follow_up TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS prescriptions (
            id TEXT PRIMARY KEY,
            patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
            doctor_id TEXT REFERENCES doctors(id),
            diagnosis TEXT,
            medications TEXT DEFAULT '[]',
            notes TEXT,
            follow_up_date TEXT,
            is_active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS emergency_contacts (
            id TEXT PRIMARY KEY,
            patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            relationship TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )""")

        await db.execute("""
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            token TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        )""")

        await db.commit()
        print("[OK] SQLite: all tables ready")
