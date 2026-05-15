# Frontend Auth + History Sync Plan

> **For agentic workers:** Use superpowers:subagent-driven-development. Steps use checkbox syntax.

**Goal:** Sync frontend with new backend: login/register flow, JWT auth on uploads, history page.

**Architecture:** localStorage for JWT persistence. `AuthContext` wraps app. `authService.ts` handles token + API calls. `AuthModal` component for login/register. `HistoryPanel` for past analyses. Keep Art Deco styling.

**Tech Stack:** Next.js 15 + TypeScript + TailwindCSS, backend on localhost:8001

---

### Task 1: Auth service + Token management

**Files:**
- Create: `frontend/services/auth.ts`
- Modify: `frontend/lib/api.ts:22-38`

- [ ] **Step 1: Create `frontend/services/auth.ts` — token storage + auth API calls**

```ts
const TOKEN_KEY = "resume_ai_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface AuthResult {
  id: number;
  email: string;
  token: string;
}

export async function register(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "注册失败");
  }
  const data = await res.json();
  setToken(data.token);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "登录失败");
  }
  const data = await res.json();
  setToken(data.token);
  return data;
}

export function logout(): void {
  clearToken();
}
```

- [ ] **Step 2: Update `frontend/lib/api.ts` — add token to upload and add history APIs**

Replace `frontend/lib/api.ts`:

```ts
import { getToken } from "@/services/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  ats_compatibility: string;
  missing_keywords: string[];
  improvement_suggestions: string[];
  optimized_resume: string;
}

export interface HistoryItem {
  id: number;
  filename: string;
  file_size: number;
  created_at: string;
  analysis_count: number;
}

export interface HistoryDetail {
  id: number;
  filename: string;
  file_size: number;
  raw_text: string;
  created_at: string;
  analysis: AnalysisResult & { id: number; created_at: string } | null;
}

export async function uploadResume(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getToken();
  const res = await fetch(`${API}/api/upload`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: token } : {},
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "上传失败");
  }
  return res.json();
}

export async function fetchHistory(skip = 0, limit = 20): Promise<HistoryItem[]> {
  const token = getToken();
  const res = await fetch(`${API}/api/history?skip=${skip}&limit=${limit}`, {
    headers: { Authorization: token || "" },
  });
  if (!res.ok) throw new Error("获取历史失败");
  return res.json();
}

export async function fetchHistoryDetail(id: number): Promise<HistoryDetail> {
  const token = getToken();
  const res = await fetch(`${API}/api/history/${id}`, {
    headers: { Authorization: token || "" },
  });
  if (!res.ok) throw new Error("获取详情失败");
  return res.json();
}

export async function deleteHistory(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API}/api/history/${id}`, {
    method: "DELETE",
    headers: { Authorization: token || "" },
  });
  if (!res.ok) throw new Error("删除失败");
}
```

- [ ] **Step 3: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 2: AuthModal component — Login/Register

**Files:**
- Create: `frontend/components/AuthModal.tsx`

- [ ] **Step 1: Create `frontend/components/AuthModal.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Mail, Lock, X } from "lucide-react";
import { login, register } from "@/services/auth";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fn = mode === "login" ? login : register;
      const result = await fn(email, password);
      onSuccess(result.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-deco-ink/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded max-w-sm w-full mx-4 animate-enter" style={{ boxShadow: "8px 8px 0 0 rgba(26,39,68,0.08)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-deco-navy" style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
            {mode === "login" ? "登录" : "注册"}
          </h2>
          <button onClick={onClose} className="text-deco-warmgray hover:text-deco-ink transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-deco-warmgray uppercase tracking-wider mb-1">邮箱</label>
            <div className="flex items-center border border-deco-warmgray/30 bg-deco-pearl/50 px-3 py-2 rounded">
              <Mail className="w-4 h-4 text-deco-warmgray mr-2" />
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="bg-transparent w-full text-sm text-deco-ink placeholder:text-deco-warmgray/50 outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-deco-warmgray uppercase tracking-wider mb-1">密码</label>
            <div className="flex items-center border border-deco-warmgray/30 bg-deco-pearl/50 px-3 py-2 rounded">
              <Lock className="w-4 h-4 text-deco-warmgray mr-2" />
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="bg-transparent w-full text-sm text-deco-ink placeholder:text-deco-warmgray/50 outline-none"
                placeholder="至少 6 位"
                minLength={6}
              />
            </div>
          </div>

          {error && <p className="text-deco-rose text-xs font-medium">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-deco-navy text-deco-cream text-sm font-bold uppercase tracking-wider hover:bg-deco-brass hover:text-deco-navy transition-colors rounded disabled:opacity-50"
          >
            {loading ? "处理中..." : mode === "login" ? "登录" : "创建账号"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-deco-warmgray">
          {mode === "login" ? "还没有账号？" : "已有账号？"}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="ml-1 text-deco-navy font-bold hover:text-deco-brass transition-colors"
          >
            {mode === "login" ? "立即注册" : "去登录"}
          </button>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 3: HistoryPanel component

**Files:**
- Create: `frontend/components/HistoryPanel.tsx`

- [ ] **Step 1: Create `frontend/components/HistoryPanel.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Trash2, Clock, FileText } from "lucide-react";
import { fetchHistory, fetchHistoryDetail, deleteHistory, HistoryItem, AnalysisResult } from "@/lib/api";

interface HistoryPanelProps {
  onSelect: (result: AnalysisResult) => void;
  onClose: () => void;
}

export default function HistoryPanel({ onSelect, onClose }: HistoryPanelProps) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { setItems(await fetchHistory()); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSelect = async (id: number) => {
    try {
      const detail = await fetchHistoryDetail(id);
      if (detail.analysis) onSelect(detail.analysis);
    } catch {}
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteHistory(id);
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-deco-ink/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-deco-cream overflow-auto p-6 animate-enter" style={{ boxShadow: "-8px 0 0 0 rgba(26,39,68,0.04)" }}>
        <div className="flex items-center justify-between mb-8">
          <button onClick={onClose} className="flex items-center gap-1 text-sm font-bold text-deco-warmgray hover:text-deco-navy transition-colors">
            <ChevronLeft className="w-4 h-4" /> 返回
          </button>
          <h2 className="text-lg font-black text-deco-navy" style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
            历史记录
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-deco-warmgray text-sm py-12">加载中...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-10 h-10 text-deco-warmgray/30 mx-auto mb-3" />
            <p className="text-deco-warmgray text-sm">暂无历史记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="flex items-center justify-between p-4 bg-white border border-deco-warmgray/15 hover:border-deco-brass/40 gold-leaf cursor-pointer rounded transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-deco-navy" />
                  <div>
                    <p className="text-sm font-bold text-deco-navy">{item.filename}</p>
                    <p className="text-xs text-deco-warmgray">{item.created_at?.slice(0, 10)} - {item.analysis_count} 次分析</p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-1 text-deco-warmgray/40 hover:text-deco-rose transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 4: Update page.tsx — Auth state + History toggle

**Files:**
- Modify: `frontend/app/page.tsx`
- Modify: `frontend/services/analyze.ts`

- [ ] **Step 1: Update `frontend/services/analyze.ts` — remove lang param**

Replace `frontend/services/analyze.ts`:

```ts
import { uploadResume, AnalysisResult } from "@/lib/api";

export type AnalysisState =
  | { stage: "idle" }
  | { stage: "uploading" }
  | { stage: "analyzing" }
  | { stage: "done"; result: AnalysisResult }
  | { stage: "error"; message: string };

export async function runAnalysis(
  file: File,
  onStateChange: (state: AnalysisState) => void,
) {
  try {
    onStateChange({ stage: "uploading" });
    onStateChange({ stage: "analyzing" });
    const result = await uploadResume(file);
    onStateChange({ stage: "done", result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "分析失败";
    onStateChange({ stage: "error", message });
  }
}
```

- [ ] **Step 2: Update `frontend/app/page.tsx` — add auth state, user bar, history button**

Replace `frontend/app/page.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import AnalysisResult from "@/components/AnalysisResult";
import AuthModal from "@/components/AuthModal";
import HistoryPanel from "@/components/HistoryPanel";
import { runAnalysis, AnalysisState } from "@/services/analyze";
import { isLoggedIn, logout } from "@/services/auth";
import { AnalysisResult as AnalysisResultType } from "@/lib/api";
import { LogOut, History } from "lucide-react";

export default function HomePage() {
  const [state, setState] = useState<AnalysisState>({ stage: "idle" });
  const [user, setUser] = useState<string | null>(
    typeof window !== "undefined" ? (isLoggedIn() ? localStorage.getItem("resume_ai_email") : null) : null
  );
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    runAnalysis(file, setState);
  }, []);

  const handleReset = () => setState({ stage: "idle" });

  const handleAuthSuccess = (email: string) => {
    localStorage.setItem("resume_ai_email", email);
    setUser(email);
    setShowAuth(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("resume_ai_email");
    setUser(null);
    setState({ stage: "idle" });
  };

  const handleHistorySelect = (result: AnalysisResultType) => {
    setShowHistory(false);
    setState({ stage: "done", result });
  };

  return (
    <main className="min-h-screen pb-24">
      {/* User bar */}
      <div className="max-w-4xl mx-auto px-6 pt-4 flex justify-end items-center gap-3">
        {user ? (
          <>
            <span className="text-xs font-bold text-deco-warmgray">{user}</span>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1 text-xs font-bold text-deco-navy hover:text-deco-brass transition-colors"
            >
              <History className="w-3 h-3" /> 历史
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-bold text-deco-warmgray hover:text-deco-rose transition-colors"
            >
              <LogOut className="w-3 h-3" /> 退出
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="text-xs font-bold text-deco-navy hover:text-deco-brass transition-colors underline decoration-deco-brass decoration-2 underline-offset-4"
          >
            登录 / 注册
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {state.stage !== "done" && <Hero />}

        <div className={state.stage === "done" ? "mt-4" : "mt-2"}>
          <UploadZone
            onFileSelect={handleFileSelect}
            disabled={state.stage === "uploading" || state.stage === "analyzing"}
          />
        </div>

        {(state.stage === "uploading" || state.stage === "analyzing") && (
          <div className="mt-12 text-center animate-enter">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white stepped-border">
              <div className="w-5 h-5 border-2 border-deco-navy border-t-transparent rounded-full animate-spin" />
              <span className="text-deco-navy font-bold text-sm">
                {state.stage === "uploading" ? "正在上传简历..." : "AI 正在分析..."}
              </span>
            </div>
          </div>
        )}

        {state.stage === "error" && (
          <div className="mt-12 max-w-md mx-auto animate-enter">
            <div className="bg-white border border-deco-rose p-5" style={{ boxShadow: "4px 4px 0 0 rgba(192,128,129,0.2)" }}>
              <p className="font-bold text-deco-rose text-sm uppercase tracking-wider">分析失败</p>
              <p className="text-deco-ink/70 text-sm mt-1">{state.message}</p>
            </div>
            <button onClick={handleReset} className="mt-4 text-sm font-bold text-deco-navy hover:text-deco-brass transition-colors underline decoration-deco-brass decoration-2 underline-offset-4">
              重试
            </button>
          </div>
        )}

        {state.stage === "done" && (
          <>
            <div className="text-center mt-6 mb-2">
              <button onClick={handleReset} className="text-sm font-bold text-deco-navy hover:text-deco-brass transition-colors underline decoration-deco-brass decoration-2 underline-offset-4">
                分析另一份简历
              </button>
            </div>
            <AnalysisResult result={state.result} />
          </>
        )}
      </div>

      <footer className="text-center pt-16 text-xs text-deco-warmgray font-medium">
        <div className="deco-divider max-w-[200px] mx-auto mb-4">
          <div className="deco-diamond" />
        </div>
        AI 简历分析器 &mdash; 由 DeepSeek 驱动
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
      {showHistory && <HistoryPanel onSelect={handleHistorySelect} onClose={() => setShowHistory(false)} />}
    </main>
  );
}
```

- [ ] **Step 3: Full build check**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -5
```

Expected: successful build, no errors.

---

### Task 5: Dev server verification + end-to-end test

- [ ] **Step 1: Start dev server**

```bash
cd frontend && npm run dev
```

- [ ] **Step 2: Visual check**

Open http://localhost:3000, verify:
- Click "登录/注册" → modal opens, register a new account
- After login, see email in top bar, "历史" and "退出" buttons
- Upload a PDF → analysis works (with JWT)
- Click "历史" → side panel shows past uploads
- Click a history item → analysis loads
- Click delete → item removed
- Click "退出" → back to logged-out state
