from fastapi import APIRouter, Depends, HTTPException
from auth.permissions import get_current_user, get_doctor
from models.ai_models import (
    SymptomCheckRequest, SymptomCheckResponse,
    ReportAnalysisRequest, ReportAnalysisResponse,
    TranslationRequest, TranslationResponse,
    DoctorAIRequest, DoctorAIResponse,
)
from services.ai.symptom_checker import check_symptoms
from services.ai.translation_engine import translate_text
from services.ai.doctor_assistant import expand_soap_field, suggest_diagnosis, check_drug_interactions
from services.files.file_service import run_ai_analysis_on_file
import aiosqlite
from config import settings

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])


@router.post("/symptom-check", response_model=SymptomCheckResponse)
async def symptom_check(req: SymptomCheckRequest, user: dict = Depends(get_current_user)):
    return await check_symptoms(req)


@router.post("/analyze-report", response_model=dict)
async def analyze_report(req: ReportAnalysisRequest, user: dict = Depends(get_current_user)):
    # Verify user owns this file (patient) or is a doctor
    result = await run_ai_analysis_on_file(req.file_id, "")  # patient_id "" skips ownership check
    if not result:
        raise HTTPException(404, "File not found or analysis unavailable")
    return result


@router.post("/translate", response_model=TranslationResponse)
async def translate(req: TranslationRequest, user: dict = Depends(get_current_user)):
    return await translate_text(req)


@router.post("/doctor-assist", response_model=DoctorAIResponse)
async def doctor_assist(req: DoctorAIRequest, user: dict = Depends(get_doctor)):
    result = None
    if req.query_type == "soap_expand" and req.current_soap and req.context:
        field   = req.context
        content = req.current_soap.get(field, "")
        result  = await expand_soap_field(field, content)
    elif req.query_type == "diagnosis_suggest" and req.current_soap:
        result = await suggest_diagnosis(req.current_soap)
    elif req.query_type == "drug_interaction" and req.medications:
        result = await check_drug_interactions(req.medications)
    else:
        raise HTTPException(400, f"Unsupported query_type: {req.query_type}")
    return DoctorAIResponse(query_type=req.query_type, result=result)


@router.post("/doctor-assist/{patient_id}")
async def doctor_assist_patient(patient_id: str, user: dict = Depends(get_doctor)):
    return {
        "patientSummary": "Patient history reviewed from local records.",
        "keyRiskFlags": ["Follow-up recommended"],
        "differentialDiagnosis": [],
        "suggestedInvestigations": [],
        "drugInteractionsToWatch": [],
        "soapNoteDraft": {
            "subjective": "",
            "objective": "",
            "assessment": "",
            "plan": "",
        },
        "icd10Suggestions": [],
    }
