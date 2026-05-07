from services.ai.ai_config import ask_gemini
from models.ai_models import TranslationRequest, TranslationResponse

LANG_NAMES = {
    "en": "English", "hi": "Hindi", "kn": "Kannada", "ta": "Tamil",
    "te": "Telugu", "ml": "Malayalam", "mr": "Marathi", "gu": "Gujarati", "bn": "Bengali",
}


async def translate_text(req: TranslationRequest) -> TranslationResponse:
    target_name = LANG_NAMES.get(req.target_lang, req.target_lang)
    medical_ctx = "This is a medical text. Preserve all medical terminology accurately." if req.medical_context else ""

    prompt = f"""Translate the following text to {target_name}.
{medical_ctx}
Text: {req.text}

Return ONLY the translated text with no explanation or prefix."""

    translated = await ask_gemini(prompt)
    return TranslationResponse(
        original=req.text,
        translated=translated.strip() or req.text,
        target_lang=req.target_lang,
    )
