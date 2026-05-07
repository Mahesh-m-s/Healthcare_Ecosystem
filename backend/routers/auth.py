import uuid
from datetime import datetime

import aiosqlite
from fastapi import APIRouter, Depends, HTTPException, status

from auth.jwt_handler import create_access_token, create_refresh_token, verify_token
from auth.password_handler import hash_password, verify_password
from auth.permissions import get_current_user
from config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


async def _get_user_by_email(db: aiosqlite.Connection, email: str):
    db.row_factory = aiosqlite.Row
    async with db.execute("SELECT * FROM users WHERE email=?", (email.lower(),)) as cur:
        return await cur.fetchone()


def _user_payload(row: aiosqlite.Row) -> dict:
    return {
        "id": row["id"],
        "email": row["email"],
        "phone": "",
        "role": row["role"],
        "fullName": row["name"],
        "name": row["name"],
        "isVerified": bool(row["is_verified"]),
        "isActive": bool(row["is_active"]),
        "createdAt": row["created_at"],
    }


@router.post("/login")
async def login(req: dict):
    email = (req.get("email") or req.get("emailOrPhone") or "").strip().lower()
    password = req.get("password", "")
    role = req.get("role")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        row = await _get_user_by_email(db, email)
    if not row or not verify_password(password, row["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if role and row["role"] != role:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Role does not match account")
    if not row["is_active"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")

    token_data = {"sub": row["id"], "role": row["role"]}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    user = _user_payload(row)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user_id": row["id"],
        "userId": row["id"],
        "role": row["role"],
        "full_name": row["name"],
        "fullName": row["name"],
        "user": user,
    }


@router.post("/refresh")
async def refresh(req: dict):
    refresh_token = req.get("refresh_token") or req.get("refreshToken")
    payload = verify_token(refresh_token or "", token_type="refresh")
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM users WHERE id=?", (payload["sub"],)) as cur:
            row = await cur.fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    token_data = {"sub": row["id"], "role": row["role"]}
    access_token = create_access_token(token_data)
    new_refresh = create_refresh_token(token_data)
    return {
        "access_token": access_token,
        "refresh_token": new_refresh,
        "accessToken": access_token,
        "refreshToken": new_refresh,
        "role": row["role"],
        "user_id": row["id"],
        "userId": row["id"],
    }


@router.post("/register/patient", status_code=201)
async def register_patient(req: dict):
    user_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    name = (req.get("full_name") or req.get("fullName") or req.get("name") or "").strip()
    email = (req.get("email") or "").strip().lower()
    password = req.get("password") or ""
    if not name or not email or len(password) < 8:
        raise HTTPException(status_code=400, detail="Name, email and min-8-char password are required")

    allergies = req.get("allergies") or []
    if isinstance(allergies, list):
        allergies = ",".join(allergies)

    async with aiosqlite.connect(settings.sqlite_db_path) as db:
        if await _get_user_by_email(db, email):
            raise HTTPException(status_code=409, detail="Email already registered")
        await db.execute(
            "INSERT INTO users (id,email,hashed_password,name,role,is_active,is_verified,created_at,updated_at) VALUES (?,?,?,?,?,1,0,?,?)",
            (user_id, email, hash_password(password), name, "patient", now, now),
        )
        await db.execute(
            """INSERT INTO patients (id,phone,date_of_birth,gender,blood_group,allergies,created_at)
               VALUES (?,?,?,?,?,?,?)""",
            (
                user_id,
                req.get("phone"),
                req.get("date_of_birth"),
                req.get("gender"),
                req.get("blood_group"),
                allergies,
                now,
            ),
        )
        emergency_name = req.get("emergency_contact_name")
        emergency_phone = req.get("emergency_contact_phone")
        if emergency_name and emergency_phone:
            await db.execute(
                "INSERT INTO emergency_contacts (id,patient_id,name,phone,relationship,created_at) VALUES (?,?,?,?,?,?)",
                (str(uuid.uuid4()), user_id, emergency_name, emergency_phone, "Emergency Contact", now),
            )
        await db.commit()

    return {"message": "Patient registered successfully", "user_id": user_id}


@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return _user_payload(user)
