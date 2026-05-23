import type { ResumeData } from "@/lib/builder-data";

interface Props { data: ResumeData; }

export default function SwissTemplate({ data }: Props) {
  const hasEdu = data.educations.filter(e => e.school || e.major).length > 0;
  const hasWork = data.workExperience.filter(w => w.company || w.title).length > 0;
  const hasProjects = data.projects.filter(p => p.name).length > 0;
  const hasHonors = data.honors.filter(h => h.name).length > 0;

  return (
    <div id="resume-print" className="bg-white text-[#0f0f0f] max-w-[210mm] mx-auto p-10 print-a4 font-sans">
      <div className="flex gap-8">
        {/* Left sidebar — personal info */}
        <div className="w-[32%] shrink-0 border-r border-gray-200 pr-6">
          {data.avatar && (
            <img src={data.avatar} alt="" className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-gray-100" />
          )}
          {data.name && <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>}
          {data.jobStatus && <p className="text-xs text-gray-400 mt-0.5">{data.jobStatus}</p>}

          <div className="mt-6 space-y-3 text-xs leading-relaxed">
            {data.email && <div><span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">邮箱</span>{data.email}</div>}
            {data.phone && <div><span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">电话</span>{data.phone}</div>}
            {data.birthPlace && <div><span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">所在地</span>{data.birthPlace}</div>}
            {data.gender && data.birthDate && <div><span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">基本信息</span>{data.gender} · {data.birthDate}</div>}
            {data.currentCity && <div><span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">现居</span>{data.currentCity}</div>}
            {data.targetCity && <div><span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">期望城市</span>{data.targetCity}</div>}
          </div>

          {data.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[10px] uppercase tracking-widest text-[#0055ff] font-bold mb-2">技能</h3>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((s, i) => <span key={i} className="text-[10px] bg-gray-50 px-2 py-0.5">{s}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0 text-sm leading-relaxed space-y-5">
          {data.personalStrengths && (
            <p className="text-xs text-gray-500 leading-relaxed">{data.personalStrengths}</p>
          )}

          {hasEdu && (
            <Section title="教育背景">
              {data.educations.map((e, i) => (e.school || e.major) && (
                <div key={e.id} className={i > 0 ? "mt-2 pt-2 border-t border-gray-100" : ""}>
                  <p className="font-semibold text-xs">{e.school}{e.major ? ` · ${e.major}` : ""}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {[e.education, e.startYear && e.endYear ? `${e.startYear}–${e.endYear}` : "", e.endYear ? `${e.endYear}年毕业` : ""].filter(Boolean).join(" · ")}
                  </p>
                  {e.campusExperience && <p className="text-[11px] text-gray-500 mt-1">{e.campusExperience}</p>}
                </div>
              ))}
            </Section>
          )}

          {hasWork && (
            <Section title="工作经历">
              {data.workExperience.map((w, i) => (w.company || w.title) && (
                <div key={w.id} className={i > 0 ? "mt-3 pt-3 border-t border-gray-100" : ""}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-xs">{w.company}{w.title ? ` — ${w.title}` : ""}</span>
                    <span className="text-[10px] text-gray-400">{w.startDate}–{w.endDate}</span>
                  </div>
                  {w.description && <p className="text-[11px] text-gray-500 mt-1">{w.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {hasProjects && (
            <Section title="项目经历">
              {data.projects.map((p, i) => p.name && (
                <div key={p.id} className={i > 0 ? "mt-2" : ""}>
                  <span className="font-semibold text-xs">{p.name}{p.role ? ` — ${p.role}` : ""}</span>
                  {p.description && <p className="text-[11px] text-gray-500 mt-0.5">{p.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {hasHonors && (
            <Section title="所获荣誉">
              <ul className="list-disc list-inside text-[11px] text-gray-500 space-y-0.5">
                {data.honors.map(h => h.name && <li key={h.id}>{h.name}{h.date ? `（${h.date}）` : ""}</li>)}
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
      <h2 className="text-[10px] uppercase tracking-widest text-[#0055ff] font-bold mb-2">{title}</h2>
      {children}
    </div>
  );
}
