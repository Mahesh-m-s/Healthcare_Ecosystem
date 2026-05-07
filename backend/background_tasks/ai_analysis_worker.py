"""Background worker: auto-analyzes newly uploaded medical files."""
import asyncio
from services.files.file_service import run_ai_analysis_on_file
from app_websockets.manager import ws_manager
from app_websockets.events import AI_ANALYSIS_READY


async def process_file_analysis(file_id: str, patient_id: str):
    """Run AI analysis on a file and notify the patient via WebSocket."""
    try:
        result = await run_ai_analysis_on_file(file_id, patient_id)
        await ws_manager.send_to_user(patient_id, AI_ANALYSIS_READY, {
            "file_id":    file_id,
            "summary":    result.get("summary", ""),
            "risk_level": result.get("risk_level", "MEDIUM"),
        })
    except Exception as e:
        print(f"AI analysis worker error: {e}")
