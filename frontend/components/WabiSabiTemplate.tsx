import type { ResumeData } from "@/lib/builder-data";

interface Props { data: ResumeData; }

export default function WabiSabiTemplate({ data }: Props) {
  const hasEdu = data.educations.filter(e => e.school || e.major).length > 0;
  const hasWork = data.workExperience.filter(w => w.company || w.title).length > 0;
  const hasProjects = data.projects.filter(p => p.name).length > 0;
  const hasHonors = data.honors.filter(h => h.name).length > 0;

  return (
    <div id="resume-print" className="bg-[#f5f0eb] text-[#3a3a3a] max-w-[210mm] mx-auto p-10 print-a4"
      style={{ fontFamily: "'IBM Plex Sans', 'Noto Serif SC', serif" }}>
      {/* Header — asymmetric */}
      <div className="flex items-end gap-6 mb-8 pb-6 border-b border-[#3a3a3a]/15">
        <div className="shrink-0">
          {data.avatar ? (
            <img src={data.avatar} alt="" className="w-20 h-20 object-cover border border-[#3a3a3a]/10" />
          ) : (
            <div className="w-20 h-20 border border-[#3a3a3a]/10 bg-white/50" />
          )}
        </div>
        <div className="flex-1">
          {data.name && <h1 className="text-2xl font-light tracking-wider text-[#2d4059]" style={{ fontFamily: "'Noto Serif SC', serif" }}>{data.name}</h1>}
          {data.jobStatus && <p className="text-xs text-[#888] mt-1">{data.jobStatus}</p>}
          <div className="flex flex-wrap gap-x-5 gap-y-0.5 mt-2 text-[10px] text-[#888]">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.birthPlace && <span>{data.birthPlace}</span>}
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex gap-8">
        {/* Left — compact info */}
        <div className="w-[28%] shrink-0 space-y-4 text-xs">
          {(data.gender || data.birthDate || data.currentCity || data.targetCity) && (
            <div className="space-y-1">
              {data.gender && <p>性别 <span className="text-[#888]">{data.gender}</span></p>}
              {data.birthDate && <p>出生 <span className="text-[#888]">{data.birthDate}</span></p>}
              {data.currentCity && <p>现居 <span className="text-[#888]">{data.currentCity}</span></p>}
              {data.targetCity && <p>期望 <span className="text-[#888]">{data.targetCity}</span></p>}
            </div>
          )}

          {data.skills.length > 0 && (
            <div>
              <h3 className="text-[10px] text-[#2d4059] font-bold mb-1.5 pl-1 border-l-2 border-[#2d4059]/40">技能</h3>
              <div className="space-y-0.5">
                {data.skills.map((s, i) => <p key={i} className="text-[10px] text-[#666]">{s}</p>)}
              </div>
            </div>
          )}
        </div>

        {/* Right — main content */}
        <div className="flex-1 min-w-0 space-y-5 text-sm leading-relaxed">
          {data.personalStrengths && (
            <p className="text-xs text-[#666] leading-relaxed italic">{data.personalStrengths}</p>
          )}

          {hasEdu && (
            <Section title="教育背景">
              {data.educations.map((e, i) => (e.school || e.major) && (
                <div key={e.id} className={i > 0 ? "mt-2 pt-2 border-t border-[#3a3a3a]/08" : ""}>
                  <p className="font-medium text-xs">{e.school}{e.major ? ` · ${e.major}` : ""}</p>
                  <p className="text-[10px] text-[#888] mt-0.5">
                    {[e.education, e.startYear && e.endYear ? `${e.startYear}–${e.endYear}` : "", e.endYear ? `${e.endYear}年毕业` : ""].filter(Boolean).join(" · ")}
                  </p>
                  {e.campusExperience && <p className="text-[10px] text-[#666] mt-1">{e.campusExperience}</p>}
                </div>
              ))}
            </Section>
          )}

          {hasWork && (
            <Section title="工作经历">
              {data.workExperience.map((w, i) => (w.company || w.title) && (
                <div key={w.id} className={i > 0 ? "mt-3 pt-3 border-t border-[#3a3a3a]/08" : ""}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-xs">{w.company}{w.title ? ` — ${w.title}` : ""}</span>
                    <span className="text-[10px] text-[#888]">{w.startDate}–{w.endDate}</span>
                  </div>
                  {w.description && <p className="text-[10px] text-[#666] mt-1">{w.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {hasProjects && (
            <Section title="项目经历">
              {data.projects.map((p, i) => p.name && (
                <div key={p.id} className={i > 0 ? "mt-2" : ""}>
                  <span className="font-medium text-xs">{p.name}{p.role ? ` — ${p.role}` : ""}</span>
                  {p.description && <p className="text-[10px] text-[#666] mt-0.5">{p.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {hasHonors && (
            <Section title="所获荣誉">
              <ul className="text-[10px] text-[#666] space-y-0.5 list-none">
                {data.honors.map(h => h.name && <li key={h.id}>— {h.name}{h.date ? `（${h.date}）` : ""}</li>)}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[10px] text-[#2d4059] font-bold mb-2 pl-1 border-l-2 border-[#2d4059]/40">{title}</h2>
      {children}
    </div>
  );
}
