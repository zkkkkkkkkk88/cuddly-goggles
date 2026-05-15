import type { AnalysisResult as AnalysisResultType } from "@/lib/api";
import ScoreCard from "./ScoreCard";
import SectionCard from "./SectionCard";
import OptimizedResume from "./OptimizedResume";
import { ThumbsUp, ThumbsDown, Lightbulb, ShieldCheck, Tag } from "lucide-react";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

function atsAccent(text: string): "brass" | "rose" | "sage" {
  if (text.includes("High") || text.includes("高")) return "sage";
  if (text.includes("Low") || text.includes("低")) return "rose";
  return "brass";
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="relative max-w-3xl mx-auto mt-10 space-y-5">
      <div className="animate-enter">
        <ScoreCard score={result.score} />
      </div>

      <div className="animate-enter-1">
        <SectionCard
          title="ATS 兼容性"
          icon={<ShieldCheck className="w-4 h-4" />}
          accent={atsAccent(result.ats_compatibility)}
        >
          <p className="font-semibold text-base">{result.ats_compatibility}</p>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-enter-1">
        <SectionCard title="优点" icon={<ThumbsUp className="w-4 h-4" />} accent="sage">
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-deco-sage font-bold mt-0.5 flex-shrink-0">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="问题" icon={<ThumbsDown className="w-4 h-4" />} accent="rose">
          <ul className="space-y-2">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-deco-rose font-bold mt-0.5 flex-shrink-0">&minus;</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="animate-enter-2">
        <SectionCard title="缺失关键词" icon={<Tag className="w-4 h-4" />} accent="brass">
          <div className="flex flex-wrap gap-2">
            {result.missing_keywords.map((kw, i) => (
              <span key={i} className="px-3 py-1.5 border border-deco-brass/30 bg-deco-pearl text-deco-navy text-xs font-semibold hover:border-deco-brass hover:bg-deco-brass/10 transition-colors cursor-default">
                {kw}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="animate-enter-2">
        <SectionCard title="改进建议" icon={<Lightbulb className="w-4 h-4" />} accent="brass">
          <ol className="space-y-3 list-none">
            {result.improvement_suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 bg-deco-navy text-deco-cream text-xs font-bold flex items-center justify-center mt-0.5"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      <div className="animate-enter-2">
        <OptimizedResume content={result.optimized_resume} />
      </div>
    </div>
  );
}
