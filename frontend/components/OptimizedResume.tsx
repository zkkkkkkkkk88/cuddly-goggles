"use client";

import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";

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
    <div className="bg-white border border-ink-200 rounded-lg overflow-hidden animate-enter">
      <div className="flex items-center justify-between px-6 py-4 border-b border-ink-200 bg-ink-100">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-ink-500" />
          <div>
            <h3 className="font-semibold text-ink-900 text-sm">优化后的简历</h3>
            <p className="text-ink-400 text-xs">AI 增强的专业版本</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          disabled={!hasContent}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-ink-300 text-ink-700 hover:bg-ink-100 transition-colors disabled:opacity-30"
        >
          {copied ? (
            <><Check className="w-3 h-3" />已复制</>
          ) : (
            <><Copy className="w-3 h-3" />复制</>
          )}
        </button>
      </div>

      <div className="p-6">
        {hasContent ? (
          <div className="whitespace-pre-wrap font-sans text-sm text-ink-700 leading-relaxed">
            {content}
          </div>
        ) : (
          <p className="text-center py-10 text-ink-400 text-sm">
            暂无优化内容
          </p>
        )}
      </div>

      {hasContent && (
        <div className="px-6 py-2 border-t border-ink-100 bg-ink-50">
          <span className="text-xs text-ink-400">{content.length} 字符</span>
        </div>
      )}
    </div>
  );
}
