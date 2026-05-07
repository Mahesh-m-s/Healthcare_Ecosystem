from pydantic import BaseModel
from typing import Optional


class MedicalFileResponse(BaseModel):
    id:          str
    patient_id:  str
    file_name:   str
    file_type:   str
    report_type: str
    file_size:   int
    file_path:   str
    ai_summary:  Optional[str] = None
    risk_level:  Optional[str] = None
    uploaded_at: str


class FileUploadResponse(BaseModel):
    id:        str
    file_name: str
    file_type: str
    file_path: str
    message:   str = "File uploaded successfully"
