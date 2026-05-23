import type { ResumeData } from "@/lib/builder-data";

interface Props { data: ResumeData; }

export default function LuxuryTemplate({ data }: Props) {
  const hasEdu = data.educations.filter(e => e.school || e.major).length > 0;
  const hasWork = data.workExperience.filter(w => w.company || w.title).length > 0;
  const hasProjects = data.projects.filter(p => p.name).length > 0;
  const hasHonors = data.honors.filter(h => h.name).length > 0;

  return (
    <div id="resume-print" className="bg-[#faf8f5] text-[#2c1f14] max-w-[210mm] mx-auto p-10 print-a4"
      style={{ fontFamily: "'Lato', 'Noto Sans SC', sans-serif" }}>
      {/* Top gold double line */}
      <div className="border-t-2 border-[#b8944c] mb-1" />
      <div className="border-t border-[#b8944c]/40 mb-6" />

      {/* Header */}
      <div className="text-center mb-6">
        {data.avatar && (
          <img src={data.avatar} alt="" className="w-14 h-14 rounded-full object-cover mx-auto mb-3 border border-[#b8944c]/30" />
        )}
        {data.name && <h1 className="text-2xl font-light tracking-[0.15em] uppercase" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}>{data.name}</h1>}
        {data.jobStatus && <p className="text-xs text-[#8a7a6a] mt-1 tracking-wider uppercase">{data.jobStatus}</p>}
      </div>

      {/* Contact strip */}
      {(data.email || data.phone || data.birthPlace) && (
        <div className="flex justify-center gap-6 text-[10px] text-[#8a7a6a] tracking-wide mb-6 pb-4 border-b border-[#b8944c]/20">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.birthPlace && <span>{data.birthPlace}</span>}
          {data.gender && <span>{data.gender}</span>}
          {data.birthDate && <span>{data.birthDate}</span>}
        </div>
      )}

      {/* City info */}
      {(data.currentCity || data.targetCity) && (
        <p className="text-center text-[10px] text-[#8a7a6a] mb-6 tracking-wide">
          {data.currentCity && <>现居 {data.currentCity}</>}
          {data.currentCity && data.targetCity && " · "}
          {data.targetCity && <>期望 {data.targetCity}</>}
        </p>
      )}

      {/* Body */}
      <div className="max-w-[480px] mx-auto space-y-5 text-sm leading-relaxed">
        {data.personalStrengths && (
          <p className="text-xs text-[#5a4a3a] italic leading-relaxed text-center">{data.personalStrengths}</p>
        )}

        {data.skills.length > 0 && (
          <Section title="技能专长">
            <div className="flex flex-wrap justify-center gap-2">
              {data.skills.map((s, i) => (
                <span key={i} className="text-[10px] border border-[#b8944c]/30 px-3 py-1 tracking-wide">{s}</span>
              ))}
            </div>
          </Section>
        )}

        {hasEdu && (
          <Section title="教育背景">
            {data.educations.map((e, i) => (e.school || e.major) && (
              <div key={e.id} className={`text-center ${i > 0 ? "mt-3 pt-3 border-t border-[#b8944c]/10" : ""}`}>
                <p className="font-semibold text-xs tracking-wide">{e.school}{e.major ? ` · ${e.major}` : ""}</p>
                <p className="text-[10px] text-[#8a7a6a] mt-0.5">
                  {[e.education, e.startYear && e.endYear ? `${e.startYear}–${e.endYear}` : "", e.endYear ? `${e.endYear}年毕业` : ""].filter(Boolean).join(" · ")}
                </p>
                {e.campusExperience && <p className="text-[10px] text-[#5a4a3a] mt-1">{e.campusExperience}</p>}
              </div>
            ))}
          </Section>
        )}

        {hasWork && (
          <Section title="工作经历">
            {data.workExperience.map((w, i) => (w.company || w.title) && (
              <div key={w.id} className={i > 0 ? "mt-4 pt-4 border-t border-[#b8944c]/10" : ""}>
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <span className="font-semibold text-xs tracking-wide">{w.company}{w.title ? ` — ${w.title}` : ""}</span>
                  <span className="text-[10px] text-[#8a7a6a]">{w.startDate}–{w.endDate}</span>
                </div>
                {w.description && <p className="text-[10px] text-[#5a4a3a] mt-1.5">{w.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {hasProjects && (
          <Section title="项目经历">
            {data.projects.map((p, i) => p.name && (
              <div key={p.id} className={i > 0 ? "mt-3" : ""}>
                <span className="font-semibold text-xs tracking-wide">{p.name}{p.role ? ` — ${p.role}` : ""}</span>
                {p.description && <p className="text-[10px] text-[#5a4a3a] mt-0.5">{p.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {hasHonors && (
          <Section title="所获荣誉">
            <ul className="text-[10px] text-[#5a4a3a] space-y-1 text-center list-none">
              {data.honors.map(h => h.name && <li key={h.id}>{h.name}{h.date ? `（${h.date}）` : ""}</li>)}
            </ul>
          </Section>
        )}
      </div>

      {/* Bottom gold line */}
      <div className="border-t border-[#b8944c]/40 mt-6 mb-1" />
      <div className="border-t-2 border-[#b8944c] mb-0" />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#b8944c] font-bold text-center mb-3"
        style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}>{title}</h2>
      {children}
    </div>
  );
}
