# AI Resume Analyzer

Upload your PDF resume and get instant AI-powered analysis — scoring, ATS compatibility check, keyword suggestions, and a professionally rewritten version.

**Tech Stack:** FastAPI (Python) + Next.js (TypeScript) + TailwindCSS + DeepSeek AI + PyMuPDF

---

## Project Structure

```
resume-ai/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py             # App entry point + CORS
│   │   ├── routes/upload.py    # POST /api/upload endpoint
│   │   ├── services/
│   │   │   ├── pdf_parser.py   # PyMuPDF text extraction
│   │   │   └── ai_analyzer.py  # DeepSeek API integration
│   │   ├── core/
│   │   │   ├── config.py       # Environment config
│   │   │   └── schemas.py      # Pydantic models
│   │   └── utils/
│   │       └── text_cleaner.py # Text normalization
│   ├── requirements.txt
│   └── .env.example
├── frontend/                   # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page with state mgmt
│   │   └── globals.css         # Tailwind + base styles
│   ├── components/
│   │   ├── Hero.tsx            # Hero section
│   │   ├── UploadZone.tsx      # Drag-and-drop upload
│   │   ├── AnalysisResult.tsx  # Results container
│   │   ├── ScoreCard.tsx       # Circular score display
│   │   ├── SectionCard.tsx     # Reusable card component
│   │   └── OptimizedResume.tsx # Copy/expand optimized resume
│   ├── lib/api.ts              # API client + types
│   ├── services/analyze.ts     # Analysis state machine
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- DeepSeek API key ([Get one here](https://platform.deepseek.com))

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — add your DEEPSEEK_API_KEY

# Run the server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Run dev server
npm run dev
```

Open: http://localhost:3000

---

## API Reference

### `POST /api/upload`

Upload a PDF resume for analysis.

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | PDF file (max 10MB) |

**Response (200):**
```json
{
  "score": 85,
  "strengths": [
    "Clear section headings",
    "Quantifiable achievements"
  ],
  "weaknesses": [
    "Missing summary section",
    "Too long (3 pages)"
  ],
  "ats_compatibility": "Medium — some keywords detected but..."
  "missing_keywords": [
    "Agile",
    "AWS",
    "CI/CD"
  ],
  "improvement_suggestions": [
    "Add a professional summary...",
    "Use bullet points..."
  ],
  "optimized_resume": "JOHN DOE\nSoftware Engineer\n\n..."
}
```

### `GET /api/health`

Health check endpoint.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEEPSEEK_API_KEY` | Yes | — | Your DeepSeek API key |
| `DEEPSEEK_BASE_URL` | No | `https://api.deepseek.com` | API base URL |
| `DEEPSEEK_MODEL` | No | `deepseek-chat` | Model to use |
| `MAX_FILE_SIZE_MB` | No | `10` | Max upload size |
| `CORS_ORIGINS` | No | `http://localhost:3000` | Comma-separated allowed origins |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000` | Backend API URL |

---

## Deployment

### Backend (Render / Railway)

1. Push to GitHub
2. Create a new Web Service on Render or Railway
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in the dashboard

### Frontend (Vercel)

1. Push to GitHub
2. Import project on Vercel
3. Set framework to Next.js
4. Add `NEXT_PUBLIC_API_URL` environment variable pointing to your backend URL

---

## Security Notes

- API keys are stored in environment variables only — never committed to git
- File type validation restricts uploads to PDF only
- File size is limited to prevent abuse
- CORS is configured to allow only specified origins
