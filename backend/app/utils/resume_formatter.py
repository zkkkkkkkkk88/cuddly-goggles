"""Programmatic resume formatter — cleans and structures raw resume text without any AI fabrication."""

import re

# Section header patterns (case-insensitive match at start of line, with optional colon)
SECTION_PATTERNS = [
    # English
    r"(?:work\s+)?experience",
    r"education|academic\s+background",
    r"(?:technical\s+)?skills?|core\s+competenc(?:y|ies)",
    r"projects?|personal\s+projects?|academic\s+projects?",
    r"certifications?|licenses?",
    r"(?:professional\s+)?summary|objective|profile",
    r"awards?|honors?|achievements?",
    r"languages?",
    r"interests?|hobbies?",
    r"publications?",
    r"volunteer",
    # Chinese
    r"实习经历|工作经历|项目经历",
    r"教育背景|学历",
    r"专业技能|技能",
    r"项目|个人项目",
    r"证书|认证",
    r"个人总结|自我评价|求职意向",
    r"获奖|荣誉",
    r"语言",
    r"兴趣爱好",
    r"社团|校园经历",
]

SECTION_RE = re.compile(
    r"^\s*(" + "|".join(SECTION_PATTERNS) + r")\s*[:：]?\s*(.*)",
    re.IGNORECASE,
)

BULLET_RE = re.compile(r"^[\s]*[-•·▪▸►▪➤‣◦✅✔✖✗✘☐☑☒]\s*")


def _looks_like_bullet(line: str) -> bool:
    return bool(BULLET_RE.match(line))


def format_resume(raw_text: str) -> str:
    """
    Clean and consistently format raw resume text.
    - Detects section headers (e.g., "Experience", "教育背景") and formats them
    - Normalizes bullet points to '•'
    - Collapses excess whitespace
    - Does NOT add, remove, or change any factual content
    """
    lines = raw_text.strip().split("\n")
    result: list[str] = []
    prev_blank = False
    name_handled = False

    for line in lines:
        stripped = line.strip()

        # Collapse blank lines
        if not stripped:
            if not prev_blank:
                result.append("")
                prev_blank = True
            continue
        prev_blank = False

        # Check if this line is a section header (possibly with inline content)
        m = SECTION_RE.match(stripped)
        if m:
            header = m.group(1).strip()
            rest = m.group(2).strip()

            result.append("")
            result.append(header.upper())
            result.append("")

            if rest:
                # Inline content after section header — could be comma-separated skills, etc.
                # Split by common delimiters if it looks like a list
                parts = re.split(r"\s*[,，|/]\s*", rest)
                if len(parts) > 2:
                    for part in parts:
                        part = part.strip()
                        if part:
                            result.append(f"• {part}")
                else:
                    result.append(rest)
                result.append("")
            continue

        # Normal bullet points
        if _looks_like_bullet(stripped):
            cleaned = BULLET_RE.sub("• ", stripped)
            result.append(cleaned)
            continue

        # First non-section, non-bullet line = name
        if not name_handled:
            result.append(stripped)
            name_handled = True
            continue

        # Regular content
        result.append(stripped)

    output = "\n".join(result)
    # Collapse 3+ consecutive blank lines to 2
    output = re.sub(r"\n{3,}", "\n\n", output)
    return output.strip()
