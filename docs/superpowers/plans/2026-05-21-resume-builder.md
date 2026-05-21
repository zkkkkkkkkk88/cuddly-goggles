# Resume Builder — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development. Steps use checkbox syntax.

**Goal:** Add a resume builder with form input, live preview template, and PDF export.

**Architecture:** Single page `/builder` with left form + right preview. React state drives both. PDF export via `window.print()` with `@media print` CSS. One professional template (A4, clean typography). No backend changes needed — entirely frontend.

**Tech Stack:** Next.js 15 + TypeScript + TailwindCSS

---

### Task 1: Data types + default values

**Files:**
- Create: `frontend/lib/builder-data.ts`

- [ ] **Step 1: Create `frontend/lib/builder-data.ts`**

```ts
export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectExperience {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface Honor {
  id: string;
  name: string;
  date: string;
}

export interface ResumeData {
  avatar: string;
  name: string;
  gender: string;
  birthDate: string;
  birthPlace: string;
  email: string;
  phone: string;
  identity: string;      // 应届 / 在职
  gradYear: string;
  school: string;
  major: string;
  education: string;     // 大专 / 本科 / 硕士 / 博士
  jobStatus: string;     // 随时到岗 / 考虑中 / 在职看机会
  skills: string[];
  workExperience: WorkExperience[];
  projects: ProjectExperience[];
  honors: Honor[];
}

let _counter = 0;
export const uid = () => String(++_counter);

export const emptyWork = (): WorkExperience => ({
  id: uid(), company: "", title: "", startDate: "", endDate: "", description: "",
});

export const emptyProject = (): ProjectExperience => ({
  id: uid(), name: "", role: "", description: "",
});

export const emptyHonor = (): Honor => ({
  id: uid(), name: "", date: "",
});

export const defaultResumeData: ResumeData = {
  avatar: "",
  name: "",
  gender: "",
  birthDate: "",
  birthPlace: "",
  email: "",
  phone: "",
  identity: "",
  gradYear: "",
  school: "",
  major: "",
  education: "",
  jobStatus: "",
  skills: [],
  workExperience: [],
  projects: [],
  honors: [],
};
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 2: Builder form component

**Files:**
- Create: `frontend/components/BuilderForm.tsx`

- [ ] **Step 1: Create `frontend/components/BuilderForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import type { ResumeData, WorkExperience, ProjectExperience, Honor } from "@/lib/builder-data";
import { emptyWork, emptyProject, emptyHonor } from "@/lib/builder-data";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export default function BuilderForm({ data, onChange }: Props) {
  const update = (patch: Partial<ResumeData>) => onChange({ ...data, ...patch });

  return (
    <div className="space-y-6 h-full overflow-auto pr-2" style={{ maxHeight: "calc(100vh - 100px)" }}>
      {/* Section: Basic Info */}
      <Section title="基本信息">
        <Row>
          <Field label="姓名" value={data.name} onChange={v => update({ name: v })} />
          <Field label="性别" value={data.gender} onChange={v => update({ gender: v })} placeholder="男/女" />
        </Row>
        <Row>
          <Field label="出生年月" value={data.birthDate} onChange={v => update({ birthDate: v })} placeholder="2000-01" />
          <Field label="出生地" value={data.birthPlace} onChange={v => update({ birthPlace: v })} />
        </Row>
        <Row>
          <Field label="邮箱" value={data.email} onChange={v => update({ email: v })} placeholder="your@email.com" />
          <Field label="电话" value={data.phone} onChange={v => update({ phone: v })} />
        </Row>
      </Section>

      {/* Section: Education */}
      <Section title="教育背景">
        <Row>
          <Field label="身份" value={data.identity} onChange={v => update({ identity: v })} placeholder="应届/在职" />
          <Field label="毕业年份" value={data.gradYear} onChange={v => update({ gradYear: v })} placeholder="2026" />
        </Row>
        <Row>
          <Field label="学校" value={data.school} onChange={v => update({ school: v })} />
          <Field label="专业" value={data.major} onChange={v => update({ major: v })} />
        </Row>
        <Row>
          <Field label="学历" value={data.education} onChange={v => update({ education: v })} placeholder="大专/本科/硕士" />
          <Field label="求职状态" value={data.jobStatus} onChange={v => update({ jobStatus: v })} placeholder="随时到岗/考虑中" />
        </Row>
      </Section>

      {/* Section: Skills */}
      <Section title="技能标签">
        <input
          value={data.skills.join(", ")}
          onChange={e => update({ skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
          placeholder="Java, Python, React, ..."
          className="w-full border border-deco-warmgray/30 bg-deco-pearl/30 px-3 py-2 text-sm text-deco-ink outline-none focus:border-deco-brass"
        />
      </Section>

      {/* Section: Work Experience */}
      <Section title="工作经历">
        {data.workExperience.map((w, i) => (
          <WorkItem key={w.id} item={w} index={i}
            onChange={v => update({ workExperience: data.workExperience.map((x, j) => j === i ? v : x) })}
            onDelete={() => update({ workExperience: data.workExperience.filter((_, j) => j !== i) })} />
        ))}
        <AddBtn onClick={() => update({ workExperience: [...data.workExperience, emptyWork()] })} label="添加工作经历" />
      </Section>

      {/* Section: Projects */}
      <Section title="项目经历">
        {data.projects.map((p, i) => (
          <ProjectItem key={p.id} item={p} index={i}
            onChange={v => update({ projects: data.projects.map((x, j) => j === i ? v : x) })}
            onDelete={() => update({ projects: data.projects.filter((_, j) => j !== i) })} />
        ))}
        <AddBtn onClick={() => update({ projects: [...data.projects, emptyProject()] })} label="添加项目经历" />
      </Section>

      {/* Section: Honors */}
      <Section title="所获荣誉">
        {data.honors.map((h, i) => (
          <HonorItem key={h.id} item={h} index={i}
            onChange={v => update({ honors: data.honors.map((x, j) => j === i ? v : x) })}
            onDelete={() => update({ honors: data.honors.filter((_, j) => j !== i) })} />
        ))}
        <AddBtn onClick={() => update({ honors: [...data.honors, emptyHonor()] })} label="添加荣誉" />
      </Section>

      <div className="h-8" />
    </div>
  );
}

/* --- Sub-components --- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-deco-navy uppercase tracking-widest mb-3 pb-1.5 border-b border-deco-brass/30">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-deco-warmgray mb-1">{label}</label>
      <input
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-deco-warmgray/30 bg-deco-pearl/30 px-3 py-2 text-sm text-deco-ink outline-none focus:border-deco-brass placeholder:text-deco-warmgray/40"
      />
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-bold text-deco-brass hover:text-deco-navy transition-colors mt-2">
      <Plus className="w-3 h-3" /> {label}
    </button>
  );
}

function WorkItem({ item, index, onChange, onDelete }: {
  item: WorkExperience; index: number; onChange: (v: WorkExperience) => void; onDelete: () => void;
}) {
  return (
    <div className="border border-deco-warmgray/20 p-3 space-y-2 bg-white">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-deco-brass">#{index + 1}</span>
        <button onClick={onDelete} className="text-deco-rose hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
      </div>
      <Row>
        <Field label="公司" value={item.company} onChange={v => onChange({ ...item, company: v })} />
        <Field label="职位" value={item.title} onChange={v => onChange({ ...item, title: v })} />
      </Row>
      <Row>
        <Field label="开始" value={item.startDate} onChange={v => onChange({ ...item, startDate: v })} />
        <Field label="结束" value={item.endDate} onChange={v => onChange({ ...item, endDate: v })} />
      </Row>
      <Field label="工作描述" value={item.description} onChange={v => onChange({ ...item, description: v })} />
    </div>
  );
}

function ProjectItem({ item, index, onChange, onDelete }: {
  item: ProjectExperience; index: number; onChange: (v: ProjectExperience) => void; onDelete: () => void;
}) {
  return (
    <div className="border border-deco-warmgray/20 p-3 space-y-2 bg-white">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-deco-brass">#{index + 1}</span>
        <button onClick={onDelete} className="text-deco-rose hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
      </div>
      <Row>
        <Field label="项目名称" value={item.name} onChange={v => onChange({ ...item, name: v })} />
        <Field label="担任角色" value={item.role} onChange={v => onChange({ ...item, role: v })} />
      </Row>
      <Field label="项目描述" value={item.description} onChange={v => onChange({ ...item, description: v })} />
    </div>
  );
}

function HonorItem({ item, index, onChange, onDelete }: {
  item: Honor; index: number; onChange: (v: Honor) => void; onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-deco-brass w-4">#{index + 1}</span>
      <input value={item.name} onChange={e => onChange({ ...item, name: e.target.value })}
        placeholder="荣誉名称" className="flex-1 border border-deco-warmgray/30 bg-deco-pearl/30 px-3 py-2 text-sm outline-none focus:border-deco-brass" />
      <input value={item.date} onChange={e => onChange({ ...item, date: e.target.value })}
        placeholder="日期" className="w-28 border border-deco-warmgray/30 bg-deco-pearl/30 px-3 py-2 text-sm outline-none focus:border-deco-brass" />
      <button onClick={onDelete} className="text-deco-rose hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 3: Resume template component

**Files:**
- Create: `frontend/components/ResumeTemplate.tsx`

- [ ] **Step 1: Create `frontend/components/ResumeTemplate.tsx`**

```tsx
import type { ResumeData } from "@/lib/builder-data";

interface Props {
  data: ResumeData;
}

export default function ResumeTemplate({ data }: Props) {
  return (
    <div id="resume-print" className="bg-white text-deco-ink max-w-[210mm] mx-auto p-8 print-a4">
      {/* Header */}
      <div className="text-center border-b-2 border-deco-navy pb-4 mb-5">
        {data.name && (
          <h1 className="text-2xl font-black text-deco-navy tracking-wide">{data.name}</h1>
        )}
        {data.jobStatus && (
          <p className="text-xs text-deco-warmgray mt-1">{data.jobStatus}</p>
        )}
        {(data.email || data.phone || data.birthPlace) && (
          <div className="flex justify-center gap-4 mt-3 text-xs text-deco-warmgray">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.birthPlace && <span>{data.birthPlace}</span>}
          </div>
        )}
      </div>

      {/* Basic info row */}
      {(data.gender || data.birthDate || data.identity || data.gradYear) && (
        <div className="flex gap-4 text-xs text-deco-warmgray mb-5 flex-wrap">
          {data.gender && <span>性别：{data.gender}</span>}
          {data.birthDate && <span>出生年月：{data.birthDate}</span>}
          {data.identity && <span>身份：{data.identity}</span>}
          {data.gradYear && <span>毕业年份：{data.gradYear}</span>}
        </div>
      )}

      {/* Education */}
      {(data.school || data.major || data.education) && (
        <Section title="教育背景">
          <p className="text-sm font-bold">{data.school}{data.major ? ` · ${data.major}` : ""}</p>
          <p className="text-xs text-deco-warmgray mt-0.5">
            {data.education}{data.gradYear ? ` · ${data.gradYear}年毕业` : ""}
          </p>
        </Section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <Section title="技能">
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, i) => (
              <span key={i} className="px-2 py-0.5 bg-deco-navy text-deco-cream text-xs font-medium">{s}</span>
            ))}
          </div>
        </Section>
      )}

      {/* Work Experience */}
      {data.workExperience.filter(w => w.company || w.title).length > 0 && (
        <Section title="工作经历">
          {data.workExperience.map((w, i) => (
            (w.company || w.title) && (
              <div key={w.id} className={i > 0 ? "mt-3" : ""}>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold">{w.company}{w.title ? ` — ${w.title}` : ""}</span>
                  <span className="text-xs text-deco-warmgray">{w.startDate}–{w.endDate}</span>
                </div>
                {w.description && <p className="text-xs text-deco-ink/75 mt-1">{w.description}</p>}
              </div>
            )
          ))}
        </Section>
      )}

      {/* Projects */}
      {data.projects.filter(p => p.name).length > 0 && (
        <Section title="项目经历">
          {data.projects.map((p, i) => (
            p.name && (
              <div key={p.id} className={i > 0 ? "mt-3" : ""}>
                <span className="text-sm font-bold">{p.name}{p.role ? ` — ${p.role}` : ""}</span>
                {p.description && <p className="text-xs text-deco-ink/75 mt-1">{p.description}</p>}
              </div>
            )
          ))}
        </Section>
      )}

      {/* Honors */}
      {data.honors.filter(h => h.name).length > 0 && (
        <Section title="所获荣誉">
          <ul className="list-disc list-inside text-xs text-deco-ink/75 space-y-0.5">
            {data.honors.map(h => (
              h.name && <li key={h.id}>{h.name}{h.date ? `（${h.date}）` : ""}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* PRINT styles: injected via <style> in page.tsx */}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-black text-deco-navy uppercase tracking-widest border-b border-deco-brass/30 pb-1 mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 4: Builder page (form + preview + export)

**Files:**
- Create: `frontend/app/builder/page.tsx`
- Modify: `frontend/app/globals.css` (add print styles)

- [ ] **Step 1: Create `frontend/app/builder/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import BuilderForm from "@/components/BuilderForm";
import ResumeTemplate from "@/components/ResumeTemplate";
import { defaultResumeData, ResumeData } from "@/lib/builder-data";

export default function BuilderPage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeData>(() => {
    // Try to restore from session storage
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("builder_data");
      if (saved) try { return JSON.parse(saved); } catch {}
    }
    return defaultResumeData;
  });

  const handleChange = (newData: ResumeData) => {
    setData(newData);
    sessionStorage.setItem("builder_data", JSON.stringify(newData));
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-deco-cream">
      {/* Top bar */}
      <div className="border-b border-deco-brass/20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-bold text-deco-warmgray hover:text-deco-navy transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回
          </button>
          <h1 className="text-lg font-black text-deco-navy" style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
            简历生成器
          </h1>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold bg-deco-navy text-deco-cream hover:bg-deco-brass hover:text-deco-navy transition-colors">
            <Printer className="w-4 h-4" /> 导出 PDF
          </button>
        </div>
      </div>

      {/* Main content: form left, preview right */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left: Form */}
        <div className="bg-white rounded p-6 border border-deco-warmgray/15" style={{ boxShadow: "4px 4px 0 0 rgba(200,169,81,0.08)" }}>
          <BuilderForm data={data} onChange={handleChange} />
        </div>

        {/* Right: Preview */}
        <div className="bg-gray-200 rounded p-4 flex items-start justify-center" style={{ minHeight: "calc(100vh - 120px)" }}>
          <div className="bg-white shadow-lg print-container" style={{ transform: "scale(0.75)", transformOrigin: "top center" }}>
            <ResumeTemplate data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add print styles to `frontend/app/globals.css`**

Append to the end of the file:

```css
/* Print styles for resume export */
@media print {
  body * {
    visibility: hidden;
  }
  #resume-print, #resume-print * {
    visibility: visible;
  }
  #resume-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm;
  }
  .print-a4 {
    padding: 15mm !important;
  }
}
```

- [ ] **Step 3: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 5: Link from analysis page to builder

**Files:**
- Modify: `frontend/app/page.tsx`

- [ ] **Step 1: Add "生成简历" link in page.tsx**

In the `done` state section, add a link after the "分析另一份简历" button:

```tsx
import Link from "next/link";

// ...inside {state.stage === "done" && ...}, right after the reset button:
<div className="text-center mt-6 mb-2 flex items-center justify-center gap-4">
  <button onClick={handleReset} className="text-sm font-bold ...">
    分析另一份简历
  </button>
  <Link href="/builder" className="text-sm font-bold text-deco-navy hover:text-deco-brass transition-colors underline decoration-deco-brass decoration-2 underline-offset-4">
    生成简历
  </Link>
</div>
```

- [ ] **Step 2: Verify compilation**

```bash
cd frontend && npx next build --no-lint 2>&1 | tail -3
```

---

### Task 6: End-to-end test

- [ ] **Step 1: Start dev server**

```bash
cd frontend && npm run dev
```

- [ ] **Step 2: Manual test checklist**

Open http://localhost:3000/builder:
- [ ] Fill in name, email, school → right side preview updates in real-time
- [ ] Leave gender blank → not shown in preview
- [ ] Add 2 work experiences → both shown
- [ ] Click "添加项目经历" → new empty row appears
- [ ] Click trash → row removed
- [ ] Click "导出 PDF" → browser print dialog opens
- [ ] From analysis page → click "生成简历" → goes to /builder
- [ ] Refresh page → form data persists (sessionStorage)
