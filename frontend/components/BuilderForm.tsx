"use client";

import { useRef } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import type { ResumeData, WorkExperience, Education, ProjectExperience, Honor } from "@/lib/builder-data";
import { emptyWork, emptyEducation, emptyProject, emptyHonor } from "@/lib/builder-data";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export default function BuilderForm({ data, onChange }: Props) {
  const update = (patch: Partial<ResumeData>) => onChange({ ...data, ...patch });

  return (
    <div className="space-y-6 h-full overflow-auto pr-2" style={{ maxHeight: "calc(100vh - 140px)" }}>
      {/* 基本信息 */}
      <Section title="基本信息">
        <div className="flex items-start gap-4 mb-3">
          {/* Avatar */}
          <div>
            <label className="block text-[11px] font-bold text-deco-warmgray mb-1">头像</label>
            <AvatarUpload avatar={data.avatar} onChange={v => update({ avatar: v })} />
          </div>
          <div className="flex-1 space-y-2">
            <Row>
              <Field label="姓名" value={data.name} onChange={v => update({ name: v })} />
              <SelectField label="性别" value={data.gender} onChange={v => update({ gender: v })} options={["", "男", "女"]} />
            </Row>
          </div>
        </div>
        <Row>
          <div>
            <label className="block text-[11px] font-bold text-deco-warmgray mb-1">出生年月</label>
            <input type="date" value={data.birthDate} onChange={e => update({ birthDate: e.target.value })}
              className="w-full border border-deco-warmgray/30 bg-deco-pearl/30 px-3 py-2 text-sm text-deco-ink outline-none focus:border-deco-brass" />
          </div>
          <Field label="出生地" value={data.birthPlace} onChange={v => update({ birthPlace: v })} />
        </Row>
        <Row>
          <Field label="邮箱" value={data.email} onChange={v => update({ email: v })} placeholder="your@email.com" />
          <Field label="电话" value={data.phone} onChange={v => update({ phone: v })} />
        </Row>
        <Row>
          <SelectField label="求职状态" value={data.jobStatus} onChange={v => update({ jobStatus: v })} options={["", "随时到岗", "考虑中", "在职看机会"]} />
          <Field label="现居" value={data.currentCity} onChange={v => update({ currentCity: v })} placeholder="如：北京" />
        </Row>
        <Row>
          <Field label="期望城市" value={data.targetCity} onChange={v => update({ targetCity: v })} placeholder="如：上海" />
          <div />
        </Row>
      </Section>

      {/* 教育背景 */}
      <Section title="教育背景">
        {data.educations.map((e, i) => (
          <EducationItem key={e.id} item={e} index={i}
            onChange={v => update({ educations: data.educations.map((x, j) => j === i ? v : x) })}
            onDelete={() => update({ educations: data.educations.filter((_, j) => j !== i) })} />
        ))}
        <AddBtn onClick={() => update({ educations: [...data.educations, emptyEducation()] })} label="添加教育经历" />
      </Section>

      {/* 个人优势 */}
      <Section title="个人优势">
        <textarea value={data.personalStrengths} onChange={e => update({ personalStrengths: e.target.value })}
          placeholder="例如：自学能力强，善于沟通协作..."
          className="w-full border border-deco-warmgray/30 bg-deco-pearl/30 px-3 py-2 text-sm text-deco-ink outline-none focus:border-deco-brass h-24 resize-y" />
      </Section>

      {/* 技能标签 */}
      <Section title="技能标签">
        <input
          value={data.skills.join(", ")}
          onChange={e => update({ skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
          placeholder="Java, Python, React, ..."
          className="w-full border border-deco-warmgray/30 bg-deco-pearl/30 px-3 py-2 text-sm text-deco-ink outline-none focus:border-deco-brass"
        />
      </Section>

      {/* 工作经历 */}
      <Section title="工作经历">
        {data.workExperience.map((w, i) => (
          <WorkItem key={w.id} item={w} index={i}
            onChange={v => update({ workExperience: data.workExperience.map((x, j) => j === i ? v : x) })}
            onDelete={() => update({ workExperience: data.workExperience.filter((_, j) => j !== i) })} />
        ))}
        <AddBtn onClick={() => update({ workExperience: [...data.workExperience, emptyWork()] })} label="添加工作经历" />
      </Section>

      {/* 项目经历 */}
      <Section title="项目经历">
        {data.projects.map((p, i) => (
          <ProjectItem key={p.id} item={p} index={i}
            onChange={v => update({ projects: data.projects.map((x, j) => j === i ? v : x) })}
            onDelete={() => update({ projects: data.projects.filter((_, j) => j !== i) })} />
        ))}
        <AddBtn onClick={() => update({ projects: [...data.projects, emptyProject()] })} label="添加项目经历" />
      </Section>

      {/* 所获荣誉 */}
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

function EducationItem({ item, index, onChange, onDelete }: {
  item: Education; index: number; onChange: (v: Education) => void; onDelete: () => void;
}) {
  const years = ["", ...Array.from({length: 35}, (_, i) => String(new Date().getFullYear() + 5 - i))];
  return (
    <div className="border border-deco-warmgray/20 p-3 space-y-2 bg-white">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-deco-brass">教育经历 #{index + 1}</span>
        <button onClick={onDelete} className="text-deco-rose hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
      </div>
      <Row>
        <Field label="学校" value={item.school} onChange={v => onChange({ ...item, school: v })} />
        <Field label="专业" value={item.major} onChange={v => onChange({ ...item, major: v })} />
      </Row>
      <Row>
        <SelectField label="学历" value={item.education} onChange={v => onChange({ ...item, education: v })} options={["", "大专", "本科", "硕士", "博士"]} />
        <SelectField label="入学年份" value={item.startYear} onChange={v => onChange({ ...item, startYear: v })} options={years} />
      </Row>
      <Row>
        <SelectField label="毕业年份" value={item.endYear} onChange={v => onChange({ ...item, endYear: v })} options={years} />
        <div />
      </Row>
      <div>
        <label className="block text-[11px] font-bold text-deco-warmgray mb-1">在校经历</label>
        <textarea value={item.campusExperience} onChange={e => onChange({ ...item, campusExperience: e.target.value })}
          placeholder="社团、学生会、竞赛、奖学金等在校活动..."
          className="w-full border border-deco-warmgray/30 bg-deco-pearl/30 px-3 py-2 text-sm text-deco-ink outline-none focus:border-deco-brass h-20 resize-y" />
      </div>
    </div>
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

/* --- Select field with dropdown --- */
function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-deco-warmgray mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-deco-warmgray/30 bg-deco-pearl/30 px-3 py-2 text-sm text-deco-ink outline-none focus:border-deco-brass">
        {options.map(opt => (
          <option key={opt} value={opt}>{opt || "请选择"}</option>
        ))}
      </select>
    </div>
  );
}

/* --- Avatar upload with preview --- */
function AvatarUpload({ avatar, onChange }: { avatar: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        onClick={() => inputRef.current?.click()}
        className="w-16 h-16 border-2 border-dashed border-deco-warmgray/30 rounded-full flex items-center justify-center cursor-pointer hover:border-deco-brass transition-colors overflow-hidden bg-deco-pearl/30"
      >
        {avatar ? (
          <img src={avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          <Upload className="w-5 h-5 text-deco-warmgray" />
        )}
      </div>
      <span className="text-[10px] text-deco-warmgray">点击上传</span>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
