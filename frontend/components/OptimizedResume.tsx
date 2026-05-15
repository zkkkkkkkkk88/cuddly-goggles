"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

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
    <div className="stepped-border bg-white overflow-hidden animate-enter">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-deco-navy">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-deco-brass rotate-45" />
          <div>
            <h3 className="font-black text-deco-cream text-lg leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
              优化后的简历
            </h3>
            <p className="text-deco-brass/70 text-xs font-medium">AI 增强的专业版本</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          disabled={!hasContent}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-deco-brass text-deco-brass hover:bg-deco-brass hover:text-deco-navy transition-colors disabled:opacity-30"
        >
          {copied ? <><Check className="w-3 h-3" />已复制</> : <><Copy className="w-3 h-3" />复制</>}
        </button>
      </div>

      <div className="p-6">
        {hasContent ? (
          <div className="whitespace-pre-wrap text-sm text-deco-ink/85 leading-relaxed">
            {content}
          </div>
        ) : (
          <div className="text-center py-16 text-deco-warmgray">
            <div className="deco-divider max-w-[120px] mx-auto mb-4">
              <div className="deco-diamond" />
            </div>
            <p className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
              暂无优化内容
            </p>
          </div>
        )}
      </div>

      {hasContent && (
        <div className="px-6 py-2 border-t border-deco-brass/20 bg-deco-pearl flex justify-between items-center">
          <span className="text-xs text-deco-warmgray font-medium">{content.length} 字符</span>
          <span className="text-xs text-deco-brass/60 font-medium">AI 生成</span>
        </div>
      )}
    </div>
  );
}
