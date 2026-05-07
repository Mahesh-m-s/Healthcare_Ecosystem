import json
from services.ai.ai_config import ask_gemini


async def triage_emergency(description: str, patient_context: str = "") -> dict:
    prompt = f"""You are an emergency triage AI. Assess this situation rapidly.
Situation: {description}
{f"Patient context: {patient_context}" if patient_context else ""}

Return ONLY valid JSON:
{{
  "triage_score": 1-5,
  "severity": "LOW|MEDIUM|HIGH|CRITICAL",
  "immediate_actions": ["action1", "action2"],
  "suspected_conditions": ["..."],
  "transport_priority": "standard|priority|immediate"
}}"""
    raw = await ask_gemini(prompt)
    try:
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(clean)
    except Exception:
        return {
            "triage_score": 3,
            "severity": "HIGH",
            "immediate_actions": ["Keep patient stable", "Dispatch ambulance"],
            "suspected_conditions": [],
            "transport_priority": "priority",
        }
