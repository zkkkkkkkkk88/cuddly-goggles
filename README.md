# AI Resume Analyzer

Upload your PDF resume and get instant AI-powered analysis — scoring, ATS compatibility check, keyword suggestions, and a professionally optimized version. Now with user accounts and history.

**Tech Stack:** FastAPI (Python) + Next.js (TypeScript) + TailwindCSS + DeepSeek AI + PyMuPDF + SQLite

---

## Features

- PDF resume parsing (multi-page, Chinese supported)
- AI analysis: score, strengths, weaknesses, ATS compatibility, missing keywords, improvement suggestions
- AI optimization: senior interviewer perspective, expands and polishes resume content while staying faithful to original
- User system: register, login, JWT authentication
- History: view, restore, and delete past analyses
- Resume builder: online form editor with auto-save, live template preview, PDF export
- Profile persistence: resume builder data bound to user account, survives logout/login
- Sidebar navigation with Art Deco inspired UI

---

## Project Structure

```
resume-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI entry point + CORS
│   │   ├── core/
│   │   │   ├── config.py             # Environment config
│   │   │   ├── database.py           # SQLAlchemy engine + session
│   │   │   ├── schemas.py            # Pydantic models
│   │   │   └── security.py           # JWT + bcrypt password hashing
│   │   ├── models/
│   │   │   ├── user.py               # User model
│   │   │   ├── resume.py             # Resume model
│   │   │   ├── analysis.py           # Analysis model
│   │   │   └── resume_profile.py     # Resume builder profile model
│   │   ├── routes/
│   │   │   ├── auth.py               # POST /api/auth/register, /login
│   │   │   ├── upload.py             # POST /api/upload (auth protected)
│   │   │   ├── history.py            # GET/DELETE /api/history
│   │   │   └── profile.py            # GET/PUT /api/profile
│   │   ├── schemas/
│   │   │   └── user.py               # Auth request/response models
│   │   ├── services/
│   │   │   ├── pdf_parser.py         # PyMuPDF text extraction
│   │   │   └── ai_analyzer.py        # DeepSeek API analysis + optimization
│   │   └── utils/
│   │       ├── text_cleaner.py       # Text normalization
│   │       └── resume_formatter.py   # Programmatic formatting (fallback)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Main page (auth guard + upload)
│   │   ├── login/page.tsx            # Login/Register page
│   │   ├── builder/page.tsx          # Resume builder (edit + preview tabs)
│   │   └── globals.css               # Tailwind + Art Deco styles
│   ├── components/
│   │   ├── Hero.tsx                  # Hero section
│   │   ├── UploadZone.tsx            # Drag-and-drop upload
│   │   ├── AnalysisResult.tsx        # Results container
│   │   ├── ScoreCard.tsx             # Score ring display
│   │   ├── SectionCard.tsx           # Reusable card component
│   │   ├── OptimizedResume.tsx       # Optimized resume display
│   │   ├── HistoryPanel.tsx          # History sidebar
│   │   ├── BuilderForm.tsx           # Resume form (15+ fields)
│   │   └── ResumeTemplate.tsx        # A4 template preview
│   ├── lib/
│   │   ├── api.ts                    # API client + types
│   │   ├── builder-data.ts           # Builder types + defaults
│   │   └── profile-api.ts            # Profile save/load API client
│   ├── services/
│   │   ├── auth.ts                   # JWT token management + auth API
│   │   └── analyze.ts                # Analysis state machine
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
uvicorn app.main:app --reload --port 8001
```

API docs: http://localhost:8001/docs

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL to match backend port

# Run dev server
npm run dev
```

Open: http://localhost:3000

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register (email + password → JWT) |
| `POST` | `/api/auth/login` | No | Login (email + password → JWT) |

### Upload & Analysis

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/upload` | Yes | Upload PDF, returns analysis |

**Request:** `multipart/form-data` + `Authorization` header

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | PDF file (max 10MB) |

**Response (200):**
```json
{
  "score": 72,
  "strengths": ["知名公司工作经历", "有团队领导经验"],
  "weaknesses": ["简历内容过于简略", "缺乏量化成果"],
  "ats_compatibility": "中 — 可解析基本字段但关键词覆盖不足",
  "missing_keywords": ["Docker", "CI/CD", "微服务"],
  "improvement_suggestions": ["为每段经历补充技术细节...", "扩展技能列表..."],
  "optimized_resume": "张三 | 求职意向：Java开发工程师\n\n..."
}
```

### History

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/history?skip=0&limit=20` | Yes | List user's analyses |
| `GET` | `/api/history/{id}` | Yes | Get analysis detail |
| `DELETE` | `/api/history/{id}` | Yes | Delete a record |

### Profile (Resume Builder)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/profile` | Yes | Get saved resume builder data |
| `PUT` | `/api/profile` | Yes | Save resume builder data |

**PUT Request:** `application/json` + `Authorization` header
```json
{"data": {"name": "...", "school": "...", "skills": ["..."], ...}}
```

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | No | Health check |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEEPSEEK_API_KEY` | Yes | — | Your DeepSeek API key |
| `DEEPSEEK_BASE_URL` | No | `https://api.deepseek.com/v1` | API base URL |
| `DEEPSEEK_MODEL` | No | `deepseek-chat` | Model to use |
| `MAX_FILE_SIZE_MB` | No | `10` | Max upload size |
| `CORS_ORIGINS` | No | `http://localhost:3000` | Comma-separated allowed origins |
| `DATABASE_URL` | No | `sqlite:///./resume_ai.db` | Database connection string |
| `JWT_SECRET` | No | `change-me-in-production` | JWT signing key |
| `JWT_ALGORITHM` | No | `HS256` | JWT algorithm |
| `JWT_EXPIRE_MINUTES` | No | `10080` | Token expiry (7 days) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8001` | Backend API URL |

---

## Deployment

### Backend

1. Push to GitHub
2. Create a Web Service on Render/Railway or a VPS
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env.example`

> For production, change `DATABASE_URL` to PostgreSQL and set a strong `JWT_SECRET`.

### Frontend (Vercel)

1. Push to GitHub
2. Import project on Vercel
3. Set framework to Next.js
4. Add `NEXT_PUBLIC_API_URL` pointing to your backend URL

---

## Security

- API keys in `.env` only — `.gitignore` excludes all `.env` files
- Passwords hashed with bcrypt
- JWT tokens with configurable expiry
- File type restricted to PDF, size limited to 10MB
- CORS configured for specified origins
- SQLite database excluded from git
