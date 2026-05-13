# SaaS Dashboard UI Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade frontend from basic white-card layout to modern SaaS dashboard style with glassmorphism, gradient accents, staggered animations, and refined typography.

**Architecture:** 10 files modified, 0 created. Each component gets glassmorphism styling (`bg-white/70 backdrop-blur-md`). New CSS utilities for gradient text and stagger delays. Tailwind config gets `stagger` animation classes. No backend changes.

**Tech Stack:** Next.js 15, React 19, TailwindCSS 3, lucide-react

---

### Task 1: Tailwind Config + Global CSS — Foundation

**Files:**
- Modify: `frontend/tailwind.config.ts`
- Modify: `frontend/app/globals.css`

- [ ] **Step 1: Update tailwind.config.ts — add stagger animations and glass shadow**

Replace `frontend/tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        "stagger-1": "fadeIn 0.5s ease-out 0.1s both",
        "stagger-2": "fadeIn 0.5s ease-out 0.2s both",
        "stagger-3": "fadeIn 0.5s ease-out 0.3s both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        glass: "0 4px 24px -1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255,255,255,0.8)",
        "glass-lg": "0 12px 40px -4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255,255,255,0.8)",
        glow: "0 0 30px -4px rgba(59,130,246,0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 2: Update globals.css — gradient text utility, glass base**

Replace `frontend/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-gray-900 antialiased;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
  }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
```

- [ ] **Step 3: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

Expected: "✓ Compiled successfully" or similar.

---

### Task 2: Layout + Hero — Background & Headline

**Files:**
- Modify: `frontend/app/layout.tsx`
- Modify: `frontend/components/Hero.tsx`

- [ ] **Step 1: Update layout.tsx — diagonal gradient background**

Replace `frontend/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 简历分析 — 即时反馈与优化",
  description:
    "上传你的 PDF 简历，即刻获得 AI 驱动的评分、ATS 兼容性检测、关键词建议以及专业优化版本。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/60">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update Hero.tsx — sleek SaaS headline, gradient title**

Replace `frontend/components/Hero.tsx`:

```tsx
"use client";

import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="text-center pt-24 pb-10 px-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur border border-white/80 shadow-sm text-primary-600 text-sm font-medium mb-8">
        <Sparkles className="w-4 h-4" />
        由 DeepSeek AI 驱动
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-3xl mx-auto leading-tight">
        用 AI{" "}
        <span className="text-gradient">分析与优化</span>
        {" "}你的简历
      </h1>

      <p className="mt-6 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
        上传 PDF 简历，即刻获得 AI 驱动的评分、ATS 兼容性检测、关键词建议以及专业优化版本。
      </p>
    </section>
  );
}
```

- [ ] **Step 3: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 3: UploadZone — Glassmorphism + glow hover

**Files:**
- Modify: `frontend/components/UploadZone.tsx`

- [ ] **Step 1: Rewrite UploadZone with glass styling**

Replace `frontend/components/UploadZone.tsx`:

```tsx
"use client";

import { useCallback, useRef, useState, DragEvent } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE_MB = 10;

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("仅接受 PDF 文件。");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`文件过大。最大限制为 ${MAX_FILE_SIZE_MB}MB。`);
      return false;
    }
    return true;
  };

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={clsx(
          "relative rounded-2xl p-12 text-center cursor-pointer transition-all duration-300",
          dragOver && !disabled
            ? "bg-primary-50/80 backdrop-blur border-2 border-primary-400 shadow-glow scale-[1.02]"
            : "bg-white/60 backdrop-blur border border-white/80 shadow-glass hover:shadow-glass-lg",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary-100/80 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {!disabled && (
              <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="mt-1 text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" />
                移除
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gray-100/80 flex items-center justify-center">
              <Upload className="w-7 h-7 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">将简历 PDF 拖拽到这里</p>
              <p className="text-sm text-gray-500 mt-1">
                或点击浏览 — PDF 最大 {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 4: ScoreCard — Gradient arc ring + scale-in animation

**Files:**
- Modify: `frontend/components/ScoreCard.tsx`

- [ ] **Step 1: Rewrite ScoreCard with gradient SVG and scale-in**

Replace `frontend/components/ScoreCard.tsx`:

```tsx
"use client";

import clsx from "clsx";

interface ScoreCardProps {
  score: number;
}

function getScoreGradient(score: number): { from: string; to: string; text: string; bg: string } {
  if (score >= 80) return { from: "#16a34a", to: "#22c55e", text: "text-green-600", bg: "bg-green-50/60" };
  if (score >= 60) return { from: "#d97706", to: "#f59e0b", text: "text-amber-600", bg: "bg-amber-50/60" };
  return { from: "#dc2626", to: "#ef4444", text: "text-red-500", bg: "bg-red-50/60" };
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "优秀";
  if (score >= 70) return "良好";
  if (score >= 50) return "需要改进";
  return "需要大幅改进";
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const g = getScoreGradient(score);
  const gradId = `score-grad-${score}`;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - score / 100);

  return (
    <div className={clsx(
      "rounded-2xl p-8 text-center backdrop-blur border border-white/80 shadow-glass animate-scale-in",
      g.bg
    )}>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        AI 评分
      </h3>

      <div className="relative inline-flex items-center justify-center">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={g.from} />
              <stop offset="100%" stopColor={g.to} />
            </linearGradient>
          </defs>
          <circle
            cx="64" cy="64" r={radius}
            strokeWidth="7"
            className="stroke-gray-200/60"
            fill="none"
          />
          <circle
            cx="64" cy="64" r={radius}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={clsx("text-4xl font-bold", g.text)}>{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>

      <p className={clsx("mt-4 text-lg font-semibold", g.text)}>{getScoreLabel(score)}</p>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 5: SectionCard — Glassmorphism base card

**Files:**
- Modify: `frontend/components/SectionCard.tsx`

- [ ] **Step 1: Rewrite SectionCard with glass styling**

Replace `frontend/components/SectionCard.tsx`:

```tsx
"use client";

import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "",
  success: "border-l-green-400",
  warning: "border-l-amber-400",
  danger: "border-l-red-400",
};

export default function SectionCard({ title, icon, children, variant = "default" }: SectionCardProps) {
  return (
    <div className={`rounded-xl bg-white/60 backdrop-blur border border-white/80 shadow-glass p-6 border-l-4 ${variantStyles[variant]}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 6: AnalysisResult — Stagger children + layout polish

**Files:**
- Modify: `frontend/components/AnalysisResult.tsx`

- [ ] **Step 1: Rewrite AnalysisResult with stagger delays**

Replace `frontend/components/AnalysisResult.tsx`:

```tsx
"use client";

import type { AnalysisResult as AnalysisResultType } from "@/lib/api";
import ScoreCard from "./ScoreCard";
import SectionCard from "./SectionCard";
import OptimizedResume from "./OptimizedResume";
import { ThumbsUp, ThumbsDown, Lightbulb, ShieldCheck, Tag } from "lucide-react";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

function atsVariant(text: string): "success" | "danger" | "warning" {
  if (text.includes("High") || text.includes("高")) return "success";
  if (text.includes("Low") || text.includes("低")) return "danger";
  return "warning";
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-5">
      <div className="animate-stagger-1">
        <ScoreCard score={result.score} />
      </div>

      <div className="animate-stagger-1">
        <SectionCard
          title="ATS 兼容性"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant={atsVariant(result.ats_compatibility)}
        >
          <p className="text-lg font-medium">{result.ats_compatibility}</p>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-stagger-2">
        <SectionCard title="优点" icon={<ThumbsUp className="w-5 h-5" />} variant="success">
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">&#10003;</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="问题" icon={<ThumbsDown className="w-5 h-5" />} variant="danger">
          <ul className="space-y-2">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 mt-1 flex-shrink-0">&#10007;</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="animate-stagger-2">
        <SectionCard title="缺失关键词" icon={<Tag className="w-5 h-5" />} variant="warning">
          <div className="flex flex-wrap gap-2">
            {result.missing_keywords.map((kw, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-amber-200 text-amber-700 text-sm font-medium">
                {kw}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="animate-stagger-3">
        <SectionCard title="改进建议" icon={<Lightbulb className="w-5 h-5" />}>
          <ul className="space-y-3">
            {result.improvement_suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="animate-stagger-3">
        <OptimizedResume content={result.optimized_resume} />
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

### Task 7: OptimizedResume — Glass card polish

**Files:**
- Modify: `frontend/components/OptimizedResume.tsx`

- [ ] **Step 1: Rewrite with glass styling, cleaner footer**

Replace `frontend/components/OptimizedResume.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";

interface OptimizedResumeProps {
  content: string;
}

export default function OptimizedResume({ content }: OptimizedResumeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasContent = typeof content === "string" && content.trim().length > 0;

  return (
    <div className="rounded-2xl overflow-hidden shadow-glass-lg border border-white/80 animate-slide-up">
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-500 to-blue-600">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-white" />
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">优化后的简历</h3>
            <p className="text-blue-100 text-xs">AI 增强的专业版本</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          disabled={!hasContent}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-30"
        >
          {copied ? <><Check className="w-4 h-4" />已复制</> : <><Copy className="w-4 h-4" />复制</>}
        </button>
      </div>

      <div className="p-6 bg-white/80 backdrop-blur">
        {hasContent ? (
          <div className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
            {content}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">暂无优化内容</p>
          </div>
        )}
      </div>

      <div className="px-6 py-2 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {hasContent ? `${content.length} 字符` : "空"}
        </span>
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

### Task 8: page.tsx — Layout spacing polish

**Files:**
- Modify: `frontend/app/page.tsx`

- [ ] **Step 1: Update spacing and transitions**

Replace `frontend/app/page.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import AnalysisResult from "@/components/AnalysisResult";
import { runAnalysis, AnalysisState } from "@/services/analyze";
import { Loader2, AlertCircle } from "lucide-react";

export default function HomePage() {
  const [state, setState] = useState<AnalysisState>({ stage: "idle" });

  const handleFileSelect = useCallback((file: File) => {
    runAnalysis(file, "zh", setState);
  }, []);

  const handleReset = () => setState({ stage: "idle" });

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {state.stage !== "done" && <Hero />}

        <div className={state.stage === "done" ? "mt-4" : "mt-2"}>
          <UploadZone
            onFileSelect={handleFileSelect}
            disabled={state.stage === "uploading" || state.stage === "analyzing"}
          />
        </div>

        {state.stage === "uploading" && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/70 backdrop-blur border border-white/80 shadow-glass">
              <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
              <span className="text-primary-700 font-medium">正在上传简历...</span>
            </div>
          </div>
        )}

        {state.stage === "analyzing" && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-xl bg-white/70 backdrop-blur border border-white/80 shadow-glass">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <div>
                <p className="text-primary-700 font-semibold">AI 正在分析你的简历</p>
                <p className="text-primary-500 text-sm mt-1">可能需要几秒钟...</p>
              </div>
            </div>
          </div>
        )}

        {state.stage === "error" && (
          <div className="mt-8 max-w-xl mx-auto animate-fade-in">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50/80 backdrop-blur border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">分析失败</p>
                <p className="text-red-600 text-sm mt-1">{state.message}</p>
              </div>
            </div>
            <button onClick={handleReset} className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
              重试
            </button>
          </div>
        )}

        {state.stage === "done" && (
          <>
            <div className="text-center mt-6">
              <button onClick={handleReset} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                分析另一份简历
              </button>
            </div>
            <AnalysisResult result={state.result} />
          </>
        )}
      </div>

      <footer className="text-center py-8 text-sm text-gray-400">
        AI 简历分析器 — 由 DeepSeek 驱动
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Full build check**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -5
```

Expected: successful build, no errors.

---

### Task 9: Dev server verification

- [ ] **Step 1: Start dev server**

```bash
cd frontend && npm run dev
```

- [ ] **Step 2: Visual check**

Open http://localhost:3000, verify:
- Diagonal gradient background visible
- Hero area clean with gradient headline
- Upload zone is glass card with shadow
- Score card has gradient arc ring
- All cards have glassmorphism effect
- Stagger animations on results page
- Optimized resume has gradient blue header
