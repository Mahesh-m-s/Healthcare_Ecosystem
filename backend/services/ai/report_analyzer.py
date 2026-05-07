import json
from services.ai.ai_config import ask_gemini


async def analyze_report_text(extracted_text: str, report_type: str, language: str = "en") -> dict:
    """Analyze medical report text and return structured findings."""
    lang_note = f"Respond in {language} language." if language != "en" else ""

    prompt = f"""You are a medical AI trained to analyze {report_type.upper()} reports.
Extracted report text:
---
{extracted_text[:3000]}
---
{lang_note}

Return ONLY valid JSON:
{{
  "summary": "...",
  "findings": ["finding1", "finding2"],
  "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "follow_up": "..."
}}"""

    raw = await ask_gemini(prompt)
    try:
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(clean)
    except Exception:
        return {
            "summary":    "Analysis unavailable.",
            "findings":   [],
            "risk_level": "MEDIUM",
            "follow_up":  "Please consult your doctor.",
        }
