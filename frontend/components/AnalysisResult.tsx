"use client";

import { useState } from "react";
import type { AnalysisResult as AnalysisResultType } from "@/lib/api";
import ScoreCard from "./ScoreCard";
import SectionCard from "./SectionCard";
import OptimizedResume from "./OptimizedResume";
import { ThumbsUp, ThumbsDown, Lightbulb, ShieldCheck, Tag, ChevronDown, ChevronUp } from "lucide-react";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

function atsAccent(text: string): "brass" | "rose" | "sage" {
  if (text.includes("High") || text.includes("高")) return "sage";
  if (text.includes("Low") || text.includes("低")) return "rose";
  return "brass";
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="relative max-w-3xl mx-auto mt-10 space-y-5">
      {/* ====== 核心区域：所有人都会看 ====== */}

      <div className="animate-enter-1">
        <ScoreCard score={result.score} />
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

      {/* ====== 高级分析：少数人会看，默认折叠 ====== */}

      <div className="animate-enter-2 border border-deco-warmgray/20 bg-deco-pearl/30 rounded overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-deco-warmgray/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-deco-warmgray" />
            <span className="text-xs font-bold text-deco-warmgray uppercase tracking-widest">
              高级分析（ATS + 关键词）
            </span>
            <span className="text-[10px] text-deco-warmgray/60 font-medium">
              {showAdvanced ? "收起" : "展开"}
            </span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-deco-warmgray" />
          ) : (
            <ChevronDown className="w-4 h-4 text-deco-warmgray" />
          )}
        </button>

        {showAdvanced && (
          <div className="px-5 pb-5 space-y-4">
            <div className="pt-4">
              <h4 className="text-xs font-bold text-deco-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> ATS 兼容性
              </h4>
              <p className="text-sm text-deco-ink/75">{result.ats_compatibility}</p>
            </div>

            <div className="border-t border-deco-warmgray/15 pt-4">
              <h4 className="text-xs font-bold text-deco-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> 缺失关键词
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 border border-deco-warmgray/30 bg-white text-deco-warmgray text-xs font-medium">
                    {kw}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-deco-warmgray/60 mt-2">
                仅列出可能缺失的关键词，请根据实际情况判断是否补充
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
