from pydantic import BaseModel, Field
from typing import Optional, List


class HospitalProfile(BaseModel):
    id:             str
    user_id:        str
    hospital_name:  str
    admin_name:     str
    email:          str
    phone:          str
    address:        str
    city:           str
    state:          str
    pincode:        str
    license_number: str
    total_beds:     int = 0
    available_beds: int = 0
    icu_beds:       int = 0
    icu_available:  int = 0
    latitude:       Optional[float] = None
    longitude:      Optional[float] = None
    created_at:     str


class BedUpdate(BaseModel):
    ward:           str
    bed_number:     str
    status:         str  # available | occupied | maintenance
    patient_id:     Optional[str] = None
    bed_type:       str = "general"  # general | icu | emergency


class BedResponse(BaseModel):
    id:          str
    hospital_id: str
    ward:        str
    bed_number:  str
    status:      str
    bed_type:    str
    patient_id:  Optional[str] = None
    updated_at:  str


class BedSummary(BaseModel):
    total:     int
    available: int
    occupied:  int
    icu_total: int
    icu_avail: int


class HospitalDashboardStats(BaseModel):
    bed_summary:        BedSummary
    active_emergencies: int
    doctors_on_duty:    int
    today_admissions:   int
    today_discharges:   int
