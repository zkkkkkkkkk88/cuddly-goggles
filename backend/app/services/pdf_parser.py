import fitz  # PyMuPDF
from app.utils.text_cleaner import clean_resume_text


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract and clean text from a PDF file's bytes. Supports multi-page PDFs."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages: list[str] = []
    for page in doc:
        text = page.get_text("text")
        if text:
            pages.append(text)
    doc.close()
    raw_text = "\n".join(pages)
    return clean_resume_text(raw_text)
