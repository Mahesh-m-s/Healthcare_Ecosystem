"""Extract text from PDFs and images for AI analysis."""
from pathlib import Path


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file using pdfminer."""
    try:
        from pdfminer.high_level import extract_text
        return extract_text(file_path) or ""
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""


def extract_text_from_image(file_path: str) -> str:
    """Basic OCR via pytesseract if available, else returns empty string."""
    try:
        from PIL import Image
        import pytesseract
        img  = Image.open(file_path)
        return pytesseract.image_to_string(img)
    except ImportError:
        return ""
    except Exception as e:
        print(f"OCR error: {e}")
        return ""


def extract_text(file_path: str) -> str:
    p = Path(file_path)
    if p.suffix.lower() == ".pdf":
        return extract_text_from_pdf(file_path)
    if p.suffix.lower() in {".jpg", ".jpeg", ".png"}:
        return extract_text_from_image(file_path)
    return ""
