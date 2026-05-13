"use client";

import { useState, useCallback } from "react";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import AnalysisResult from "@/components/AnalysisResult";
import { runAnalysis, AnalysisState } from "@/services/analyze";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [state, setState] = useState<AnalysisState>({ stage: "idle" });

  const handleFileSelect = useCallback((file: File) => {
    runAnalysis(file, "zh", setState);
  }, []);

  const handleReset = () => setState({ stage: "idle" });

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {state.stage !== "done" && <Hero />}

        <div className={state.stage === "done" ? "mt-4" : "mt-2"}>
          <UploadZone
            onFileSelect={handleFileSelect}
            disabled={state.stage === "uploading" || state.stage === "analyzing"}
          />
        </div>

        {(state.stage === "uploading" || state.stage === "analyzing") && (
          <div className="mt-12 text-center animate-enter">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-ink-200 bg-white">
              <Loader2 className="w-4 h-4 text-ink-400 animate-spin" />
              <span className="text-ink-500 text-sm">
                {state.stage === "uploading" ? "正在上传简历..." : "AI 正在分析..."}
              </span>
            </div>
          </div>
        )}

        {state.stage === "error" && (
          <div className="mt-12 max-w-md mx-auto animate-enter">
            <div className="rounded-lg border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-700 text-sm">分析失败</p>
              <p className="text-red-600 text-sm mt-1">{state.message}</p>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 text-sm text-ink-500 hover:text-ink-700 underline underline-offset-2"
            >
              重试
            </button>
          </div>
        )}

        {state.stage === "done" && (
          <>
            <div className="text-center mt-6 mb-2">
              <button
                onClick={handleReset}
                className="text-sm text-ink-500 hover:text-ink-700 underline underline-offset-2"
              >
                分析另一份简历
              </button>
            </div>
            <AnalysisResult result={state.result} />
          </>
        )}
      </div>

      <footer className="text-center pt-16 text-xs text-ink-400">
        AI 简历分析器 &mdash; 由 DeepSeek 驱动
      </footer>
    </main>
  );
}
