import io
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    # Try PyMuPDF (fitz)
    try:
        import fitz
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        chunks = [page.get_text() for page in doc]
        return "\n".join(chunks)
    except Exception as e:
        logger.warning(f"fitz PDF extraction failed: {e}. Trying pypdf fallback...")

    # Fallback to pypdf
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        chunks = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(chunks)
    except Exception as e2:
        logger.error(f"pypdf extraction failed: {e2}")
        return ""
