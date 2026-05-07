from pydantic import BaseModel
from typing import Optional, List, Any


class SymptomCheckRequest(BaseModel):
    symptoms:        List[str]
    age:             Optional[int] = None
    gender:          Optional[str] = None
    medical_history: Optional[str] = None
    language:        str = "en"


class SymptomCheckResponse(BaseModel):
    possible_conditions: List[dict]
    urgency_level:       str  # LOW | MEDIUM | HIGH | CRITICAL
    recommendation:      str
    disclaimer:          str
    raw_response:        Optional[str] = None


class ReportAnalysisRequest(BaseModel):
    file_id:     str
    report_type: str  # mri | ct | xray | blood | ecg | prescription | discharge
    language:    str = "en"


class ReportAnalysisResponse(BaseModel):
    file_id:     str
    report_type: str
    summary:     str
    findings:    List[str]
    risk_level:  str
    follow_up:   Optional[str] = None
    raw_text:    Optional[str] = None


class TranslationRequest(BaseModel):
    text:          str
    target_lang:   str
    source_lang:   str = "en"
    medical_context: bool = True


class TranslationResponse(BaseModel):
    original:    str
    translated:  str
    target_lang: str


class DoctorAIRequest(BaseModel):
    patient_id:   str
    query_type:   str  # soap_expand | diagnosis_suggest | drug_interaction | icd_lookup
    context:      Optional[str] = None
    current_soap: Optional[dict] = None
    medications:  Optional[List[str]] = None
    language:     str = "en"


class DoctorAIResponse(BaseModel):
    query_type: str
    result:     Any
    disclaimer: str = "AI suggestions are for assistance only. Clinical judgment must prevail."
