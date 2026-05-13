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
    <div className="max-w-3xl mx-auto mt-10 space-y-5">
      <ScoreCard score={result.score} />

      <SectionCard
        title="ATS 兼容性"
        icon={<ShieldCheck className="w-4 h-4" />}
        variant={atsVariant(result.ats_compatibility)}
      >
        <p className="font-medium">{result.ats_compatibility}</p>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="优点" icon={<ThumbsUp className="w-4 h-4" />} variant="success">
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">&#10003;</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="问题" icon={<ThumbsDown className="w-4 h-4" />} variant="danger">
          <ul className="space-y-2">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">&#10007;</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="缺失关键词" icon={<Tag className="w-4 h-4" />} variant="warning">
        <div className="flex flex-wrap gap-2">
          {result.missing_keywords.map((kw, i) => (
            <span key={i} className="px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              {kw}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="改进建议" icon={<Lightbulb className="w-4 h-4" />}>
        <ol className="space-y-3 list-none">
          {result.improvement_suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-ink-900 text-white text-xs font-medium flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      <OptimizedResume content={result.optimized_resume} />
    </div>
  );
}
