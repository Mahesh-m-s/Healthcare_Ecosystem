import json
from services.ai.ai_config import ask_gemini


async def expand_soap_field(field: str, content: str, patient_context: str = "") -> str:
    prompt = f"""You are an AI clinical assistant helping a doctor write detailed SOAP notes.
Expand and improve the following {field.upper()} section of a SOAP note.
{f"Patient context: {patient_context}" if patient_context else ""}
Current text: {content}

Return only the improved text, no explanations."""
    return (await ask_gemini(prompt)).strip() or content


async def suggest_diagnosis(soap: dict, patient_context: str = "") -> list:
    prompt = f"""Based on this SOAP note, suggest differential diagnoses with ICD-10 codes.
{f"Patient context: {patient_context}" if patient_context else ""}
SOAP: {json.dumps(soap, indent=2)}

Return ONLY valid JSON array:
[{{"diagnosis": "...", "icd_code": "...", "confidence": "low|medium|high"}}]"""
    raw = await ask_gemini(prompt)
    try:
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(clean)
    except Exception:
        return []


async def check_drug_interactions(medications: list) -> dict:
    meds_str = ", ".join(medications)
    prompt = f"""Check for drug interactions among: {meds_str}
Return ONLY valid JSON:
{{"interactions": [{{"drugs": ["..."], "severity": "mild|moderate|severe", "description": "..."}}], "safe": true|false}}"""
    raw = await ask_gemini(prompt)
    try:
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(clean)
    except Exception:
        return {"interactions": [], "safe": True}
