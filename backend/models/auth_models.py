from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    patient  = "patient"
    doctor   = "doctor"
    hospital = "hospital"


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"
    user_id:       str
    role:          UserRole
    full_name:     str


class PatientRegisterRequest(BaseModel):
    full_name:    str = Field(..., min_length=2, max_length=100)
    email:        EmailStr
    password:     str = Field(..., min_length=8)
    phone:        str
    date_of_birth: Optional[str] = None
    blood_group:  Optional[str] = None
    gender:       Optional[str] = None
    address:      Optional[str] = None


class HospitalRegisterRequest(BaseModel):
    hospital_name: str = Field(..., min_length=2)
    admin_name:    str = Field(..., min_length=2)
    email:         EmailStr
    password:      str = Field(..., min_length=8)
    phone:         str
    address:       str
    city:          str
    state:         str
    pincode:       str
    license_number: str


class DoctorRegisterRequest(BaseModel):
    full_name:       str = Field(..., min_length=2)
    email:           EmailStr
    password:        str = Field(..., min_length=8)
    phone:           str
    specialization:  str
    medical_reg_no:  str
    hospital_id:     Optional[str] = None
    years_experience: Optional[int] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password:     str = Field(..., min_length=8)


class UserResponse(BaseModel):
    id:        str
    full_name: str
    email:     str
    role:      UserRole
    is_active: bool
    created_at: str
