# Resume Builder V2 — Auth-bound profile + redesigned UI

> **For agentic workers:** Use superpowers:subagent-driven-development.

**Goal:** Bind resume builder data to user accounts for persistence, and redesign the builder UI with prominent entry point and tabbed interface.

**Architecture:** Backend stores profile as JSON blob in new `resume_profiles` table. Frontend builder page splits into "在线简历" (edit + auto-save to backend) and "导出简历" (preview + print). Main page button redesigned as sidebar card.

**Tech Stack:** Same — FastAPI + Next.js + SQLite, no new dependencies.

---

### Task 1: ResumeProfile model (backend)

**Files:**
- Create: `backend/app/models/resume_profile.py`
- Modify: `backend/app/models/__init__.py`

- [ ] **Step 1: Create `backend/app/models/resume_profile.py`**

```python
import json
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class ResumeProfile(Base):
    __tablename__ = "resume_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    _data = Column("profile_data", Text, default="{}")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="resume_profile")

    @property
    def data(self) -> dict:
        return json.loads(self._data)

    @data.setter
    def data(self, value: dict):
        self._data = json.dumps(value, ensure_ascii=False)
```

- [ ] **Step 2: Update `backend/app/models/__init__.py`**

```python
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.models.resume_profile import ResumeProfile

__all__ = ["User", "Resume", "Analysis", "ResumeProfile"]
```

- [ ] **Step 3: Update `backend/app/models/user.py` — add relationship**

Add to User class:
```python
resume_profile = relationship("ResumeProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
```

- [ ] **Step 4: Create tables**

```bash
cd backend && source venv/Scripts/activate && python -c "
from app.core.database import engine, Base
from app.models import User, Resume, Analysis, ResumeProfile
Base.metadata.create_all(bind=engine)
print('Tables:', list(Base.metadata.tables.keys()))
"
```

---

### Task 2: Profile API routes (backend)

**Files:**
- Create: `backend/app/routes/profile.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Create `backend/app/routes/profile.py`**

```python
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_user
from app.models.resume_profile import ResumeProfile

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("")
def get_profile(authorization: str = Header(None), db: Session = Depends(get_db)):
    user_id = require_user(authorization)
    profile = db.query(ResumeProfile).filter(ResumeProfile.user_id == user_id).first()
    if not profile:
        return {"data": {}}
    return {"data": profile.data}


@router.put("")
def save_profile(body: dict, authorization: str = Header(None), db: Session = Depends(get_db)):
    user_id = require_user(authorization)
    profile = db.query(ResumeProfile).filter(ResumeProfile.user_id == user_id).first()
    if not profile:
        profile = ResumeProfile(user_id=user_id, data=body.get("data", {}))
        db.add(profile)
    else:
        profile.data = body.get("data", {})
    db.commit()
    return {"ok": True}
```

- [ ] **Step 2: Register route in `backend/app/main.py`**

Add import:
```python
from app.routes.profile import router as profile_router
```

Add registration:
```python
app.include_router(profile_router, prefix="/api")
```

- [ ] **Step 3: Test**

```bash
# GET (empty)
curl -s http://127.0.0.1:8001/api/profile -H "Authorization: $TOKEN"
# → {"data":{}}

# PUT
curl -s -X PUT http://127.0.0.1:8001/api/profile -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" -d '{"data":{"name":"张三","school":"清华"}}'
# → {"ok":true}

# GET (has data)
curl -s http://127.0.0.1:8001/api/profile -H "Authorization: $TOKEN"
# → {"data":{"name":"张三","school":"清华"}}
```

---

### Task 3: Frontend profile API client

**Files:**
- Create: `frontend/lib/profile-api.ts`

- [ ] **Step 1: Create `frontend/lib/profile-api.ts`**

```ts
import { getToken } from "@/services/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export async function fetchProfile(): Promise<Record<string, any>> {
  const token = getToken();
  const res = await fetch(`${API}/api/profile`, {
    headers: { Authorization: token || "" },
  });
  if (!res.ok) throw new Error("获取简历信息失败");
  const body = await res.json();
  return body.data || {};
}

export async function saveProfile(data: Record<string, any>): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API}/api/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: token || "" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error("保存失败");
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 4: Redesign main page — big builder entry

**Files:**
- Modify: `frontend/app/page.tsx`

- [ ] **Step 1: Replace the small inline link and user bar with a sidebar-like nav**

Add a fixed left sidebar with:
- Logo/brand
- "上传分析" link (current page, highlighted)
- "简历生成" link (to /builder, prominent card style)
- User email + logout at bottom

Replace the current top-right user bar with this sidebar approach. The sidebar is ~200px wide, fixed, with the main content scrolling to the right of it.

- [ ] **Step 2: Verify compilation**

---

### Task 5: Redesign builder page — tabs + auto-save

**Files:**
- Modify: `frontend/app/builder/page.tsx`
- Modify: `frontend/components/BuilderForm.tsx`

- [ ] **Step 1: Update `frontend/app/builder/page.tsx`**

Add tabs: "在线简历" | "导出简历"
- "在线简历" tab: shows BuilderForm + loads from backend on mount + auto-saves
- "导出简历" tab: shows ResumeTemplate preview + export button

Auto-save logic:
- On mount, call `fetchProfile()` → populate form
- On every form change, debounce 2s then call `saveProfile()`
- Show "已保存" / "保存中..." indicator

- [ ] **Step 2: Update `frontend/components/BuilderForm.tsx`**

Add a `savingStatus` prop to show save state indicator ("已保存" checkmark or "保存中..." spinner) at the bottom of the form.

- [ ] **Step 3: Verify compilation**

```

---

### Task 6: End-to-end test

- [ ] **Step 1: Full flow test**

1. Login → main page shows sidebar with "简历生成" button
2. Click "简历生成" → /builder page
3. "在线简历" tab: fill in name/school/skills
4. Switch to "导出简历" tab → preview shows filled data
5. Click "导出 PDF" → print dialog
6. Logout → login again → go to /builder → data is still there
7. Edit → wait 2s → "已保存" indicator appears
```
