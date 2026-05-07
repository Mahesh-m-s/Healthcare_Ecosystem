from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class PatientProfile(BaseModel):
    id:            str
    user_id:       str
    full_name:     str
    email:         str
    phone:         str
    date_of_birth: Optional[str] = None
    blood_group:   Optional[str] = None
    gender:        Optional[str] = None
    address:       Optional[str] = None
    allergies:     Optional[str] = None
    chronic_conditions: Optional[str] = None
    created_at:    str


class UpdatePatientProfile(BaseModel):
    phone:              Optional[str] = None
    date_of_birth:      Optional[str] = None
    blood_group:        Optional[str] = None
    gender:             Optional[str] = None
    address:            Optional[str] = None
    allergies:          Optional[str] = None
    chronic_conditions: Optional[str] = None


class EmergencyContactCreate(BaseModel):
    name:         str = Field(..., min_length=2)
    relationship: str
    phone:        str
    is_primary:   bool = False


class EmergencyContactResponse(BaseModel):
    id:           str
    patient_id:   str
    name:         str
    relationship: str
    phone:        str
    is_primary:   bool


class AppointmentCreate(BaseModel):
    doctor_id:        str
    appointment_date: str
    appointment_time: str
    reason:           Optional[str] = None
    notes:            Optional[str] = None


class AppointmentResponse(BaseModel):
    id:               str
    patient_id:       str
    doctor_id:        str
    doctor_name:      Optional[str] = None
    appointment_date: str
    appointment_time: str
    status:           str
    reason:           Optional[str] = None
    notes:            Optional[str] = None
    created_at:       str
