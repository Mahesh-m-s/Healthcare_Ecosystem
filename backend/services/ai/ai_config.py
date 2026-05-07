"""Gemini AI client singleton.  Key read from env — never hardcoded."""
from typing import Optional
import google.generativeai as genai
from config import settings

_model: Optional[genai.GenerativeModel] = None


def get_gemini_model(model_name: str = "gemini-1.5-flash") -> Optional[genai.GenerativeModel]:
    global _model
    if not settings.gemini_api_key:
        return None
    if _model is None:
        genai.configure(api_key=settings.gemini_api_key)
        _model = genai.GenerativeModel(model_name)
    return _model


async def ask_gemini(prompt: str, model_name: str = "gemini-1.5-flash") -> str:
    """Send a prompt and return the text response. Returns empty string on failure."""
    model = get_gemini_model(model_name)
    if model is None:
        return ""
    try:
        response = model.generate_content(prompt)
        return response.text or ""
    except Exception as e:
        print(f"Gemini error: {e}")
        return ""
