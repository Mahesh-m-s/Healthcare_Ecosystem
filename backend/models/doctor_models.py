from pydantic import BaseModel, Field
from typing import Optional, List


class DoctorProfile(BaseModel):
    id:               str
    user_id:          str
    full_name:        str
    email:            str
    phone:            str
    specialization:   str
    medical_reg_no:   str
    hospital_id:      Optional[str] = None
    hospital_name:    Optional[str] = None
    years_experience: Optional[int] = None
    is_available:     bool = True
    created_at:       str


class SOAPNoteCreate(BaseModel):
    patient_id:  str
    appointment_id: Optional[str] = None
    subjective:  str
    objective:   str
    assessment:  str
    plan:        str
    icd_codes:   Optional[str] = None


class SOAPNoteResponse(BaseModel):
    id:             str
    doctor_id:      str
    patient_id:     str
    appointment_id: Optional[str] = None
    subjective:     str
    objective:      str
    assessment:     str
    plan:           str
    icd_codes:      Optional[str] = None
    created_at:     str


class PrescriptionCreate(BaseModel):
    patient_id:   str
    medications:  List[dict]   # [{name, dose, frequency, duration, instructions}]
    diagnosis:    Optional[str] = None
    notes:        Optional[str] = None
    valid_until:  Optional[str] = None


class PrescriptionResponse(BaseModel):
    id:          str
    doctor_id:   str
    patient_id:  str
    medications: List[dict]
    diagnosis:   Optional[str] = None
    notes:       Optional[str] = None
    valid_until: Optional[str] = None
    created_at:  str


class UpdateAvailability(BaseModel):
    is_available: bool
