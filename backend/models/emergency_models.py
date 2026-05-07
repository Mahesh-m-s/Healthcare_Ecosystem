from pydantic import BaseModel, Field
from typing import Optional, List


class SOSRequest(BaseModel):
    latitude:         float
    longitude:        float
    description:      Optional[str] = None
    severity:         str = "HIGH"  # LOW | MEDIUM | HIGH | CRITICAL
    patient_condition: Optional[str] = None


class EmergencyResponse(BaseModel):
    id:                str
    patient_id:        str
    patient_name:      Optional[str] = None
    latitude:          float
    longitude:         float
    status:            str  # pending | accepted | dispatched | arrived | resolved
    severity:          str
    description:       Optional[str] = None
    hospital_id:       Optional[str] = None
    ambulance_id:      Optional[str] = None
    triage_score:      Optional[int] = None
    ai_assessment:     Optional[str] = None
    created_at:        str
    updated_at:        str


class AcceptEmergency(BaseModel):
    emergency_id: str
    ambulance_id: Optional[str] = None


class AmbulanceLocationUpdate(BaseModel):
    ambulance_id: str
    latitude:     float
    longitude:    float
    heading:      Optional[float] = None
    speed_kmh:    Optional[float] = None


class AmbulanceResponse(BaseModel):
    id:          str
    hospital_id: str
    reg_number:  str
    driver_name: str
    driver_phone: str
    status:      str  # available | dispatched | maintenance
    latitude:    Optional[float] = None
    longitude:   Optional[float] = None
