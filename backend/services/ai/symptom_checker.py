import json
from services.ai.ai_config import ask_gemini
from models.ai_models import SymptomCheckRequest, SymptomCheckResponse

DISCLAIMER = ("This AI analysis is for informational purposes only and does not constitute "
              "medical advice. Always consult a qualified healthcare professional.")


async def check_symptoms(req: SymptomCheckRequest) -> SymptomCheckResponse:
    symptoms_str = ", ".join(req.symptoms)
    history_str  = req.medical_history or "None provided"
    lang_note    = f"Respond in {req.language} language." if req.language != "en" else ""

    prompt = f"""You are a clinical decision support AI. Analyze these symptoms and provide a structured JSON response.
Patient: Age {req.age or "unknown"}, Gender {req.gender or "unknown"}
Symptoms: {symptoms_str}
Medical history: {history_str}
{lang_note}

Return ONLY valid JSON with this exact structure:
{{
  "possible_conditions": [
    {{"name": "...", "probability": "low|medium|high", "description": "..."}}
  ],
  "urgency_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "recommendation": "...",
  "disclaimer": "{DISCLAIMER}"
}}"""

    raw = await ask_gemini(prompt)
    try:
        # Strip markdown code fences if present
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data  = json.loads(clean)
        return SymptomCheckResponse(
            possible_conditions=data.get("possible_conditions", []),
            urgency_level=data.get("urgency_level", "MEDIUM"),
            recommendation=data.get("recommendation", "Please consult a doctor."),
            disclaimer=DISCLAIMER,
            raw_response=raw,
        )
    except Exception:
        return SymptomCheckResponse(
            possible_conditions=[],
            urgency_level="MEDIUM",
            recommendation="Unable to analyze symptoms. Please consult a doctor.",
            disclaimer=DISCLAIMER,
            raw_response=raw,
        )
