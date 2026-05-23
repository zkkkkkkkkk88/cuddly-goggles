import type { ResumeData } from "@/lib/builder-data";

interface Props {
  data: ResumeData;
}

export default function ResumeTemplate({ data }: Props) {
  const hasContact = data.email || data.phone || data.birthPlace;
  const hasBasic = data.gender || data.birthDate;
  const hasEdu = data.educations.filter(e => e.school || e.major).length > 0;
  const hasWork = data.workExperience.filter(w => w.company || w.title).length > 0;
  const hasProjects = data.projects.filter(p => p.name).length > 0;
  const hasHonors = data.honors.filter(h => h.name).length > 0;

  return (
    <div id="resume-print" className="bg-white text-deco-ink max-w-[210mm] mx-auto p-8 print-a4">
      {/* Header */}
      <div className="text-center border-b-2 border-deco-navy pb-4 mb-5">
        {data.avatar && (
          <img src={data.avatar} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-deco-brass/30" />
        )}
        {data.name && (
          <h1 className="text-2xl font-black text-deco-navy tracking-wide">{data.name}</h1>
        )}
        {data.jobStatus && (
          <p className="text-xs text-deco-warmgray mt-1">{data.jobStatus}</p>
        )}
        {hasContact && (
          <div className="flex justify-center gap-4 mt-3 text-xs text-deco-warmgray">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.birthPlace && <span>{data.birthPlace}</span>}
          </div>
        )}
      </div>

      {/* Basic info row */}
      {hasBasic && (
        <div className="flex gap-4 text-xs text-deco-warmgray mb-5 flex-wrap">
          {data.gender && <span>性别：{data.gender}</span>}
          {data.birthDate && <span>出生年月：{data.birthDate}</span>}
          {data.currentCity && <span>现居：{data.currentCity}</span>}
          {data.targetCity && <span>期望城市：{data.targetCity}</span>}
        </div>
      )}

      {/* Education */}
      {hasEdu && (
        <Section title="教育背景">
          {data.educations.map((e, i) => (
            (e.school || e.major) && (
              <div key={e.id} className={i > 0 ? "mt-3 pt-3 border-t border-deco-warmgray/10" : ""}>
                <p className="text-sm font-bold">
                  {e.school}{e.major ? ` · ${e.major}` : ""}
                </p>
                <p className="text-xs text-deco-warmgray mt-0.5">
                  {[e.education, e.startYear && e.endYear ? `${e.startYear}–${e.endYear}` : "", e.endYear ? `${e.endYear}年毕业` : ""].filter(Boolean).join(" · ")}
                </p>
                {e.campusExperience && (
                  <p className="text-xs text-deco-ink/70 mt-1">{e.campusExperience}</p>
                )}
              </div>
            )
          ))}
        </Section>
      )}

      {/* Personal Strengths */}
      {data.personalStrengths && (
        <Section title="个人优势">
          <p className="text-xs text-deco-ink/75 leading-relaxed">{data.personalStrengths}</p>
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
      {hasWork && (
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
      {hasProjects && (
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
      {hasHonors && (
        <Section title="所获荣誉">
          <ul className="list-disc list-inside text-xs text-deco-ink/75 space-y-0.5">
            {data.honors.map(h => (
              h.name && <li key={h.id}>{h.name}{h.date ? `（${h.date}）` : ""}</li>
            ))}
          </ul>
        </Section>
      )}
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
