import re


def clean_resume_text(raw_text: str) -> str:
    """Clean extracted PDF text: normalize whitespace, remove PDF artifacts."""
    text = raw_text.strip()
    # Collapse 3+ newlines to 2
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Collapse 3+ spaces/tabs
    text = re.sub(r"[ \t]{3,}", "  ", text)
    # Remove control characters EXCEPT common whitespace (tab, newline, carriage return)
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)
    # Fix hyphenated line breaks from PDF: "pro-\ngram" → "program"
    text = re.sub(r"(\w)-\n(\w)", r"\1\2", text)
    return text.strip()
