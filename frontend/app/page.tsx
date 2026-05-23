"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import AnalysisResult from "@/components/AnalysisResult";
import { runAnalysis, AnalysisState } from "@/services/analyze";
import { isLoggedIn } from "@/services/auth";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AnalysisState>({ stage: "idle" });
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    // Restore saved analysis
    const saved = sessionStorage.getItem("last_analysis");
    if (saved) {
      try {
        setState({ stage: "done", result: JSON.parse(saved) });
        setRenderKey(k => k + 1);
      } catch {}
    }
    setMounted(true);
  }, [router]);

  const handleFileSelect = useCallback((file: File) => {
    runAnalysis(file, (s) => {
      setState(s);
      if (s.stage === "done") {
        sessionStorage.setItem("last_analysis", JSON.stringify(s.result));
        setRenderKey(k => k + 1);
      }
    });
  }, []);

  const handleReset = () => {
    sessionStorage.removeItem("last_analysis");
    setState({ stage: "idle" });
  };

  if (!mounted) return null;

  return (
    <main className="pb-24">
      {state.stage !== "done" && <Hero />}

      <div className="max-w-4xl mx-auto px-6">
        <div className={state.stage === "done" ? "mt-4" : "mt-2"}>
          <UploadZone
            onFileSelect={handleFileSelect}
            disabled={state.stage === "uploading" || state.stage === "analyzing"}
          />
        </div>

        {(state.stage === "uploading" || state.stage === "analyzing") && (
          <div className="mt-12 text-center animate-enter">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white stepped-border">
              <div className="w-5 h-5 border-2 border-deco-navy border-t-transparent rounded-full animate-spin" />
              <span className="text-deco-navy font-bold text-sm">
                {state.stage === "uploading" ? "正在上传简历..." : "AI 正在分析..."}
              </span>
            </div>
          </div>
        )}

        {state.stage === "error" && (
          <div className="mt-12 max-w-md mx-auto animate-enter">
            <div className="bg-white border border-deco-rose p-5" style={{ boxShadow: "4px 4px 0 0 rgba(192,128,129,0.2)" }}>
              <p className="font-bold text-deco-rose text-sm uppercase tracking-wider">分析失败</p>
              <p className="text-deco-ink/70 text-sm mt-1">{state.message}</p>
            </div>
            <button onClick={handleReset} className="mt-4 text-sm font-bold text-deco-navy hover:text-deco-brass transition-colors underline decoration-deco-brass decoration-2 underline-offset-4">
              重试
            </button>
          </div>
        )}

        {state.stage === "done" && (
          <>
            <div className="text-center mt-6 mb-2 flex items-center justify-center gap-6">
              <button onClick={handleReset} className="text-sm font-bold text-deco-navy hover:text-deco-brass transition-colors underline decoration-deco-brass decoration-2 underline-offset-4">
                分析另一份简历
              </button>
              <Link href="/builder?tab=edit" className="text-sm font-bold text-deco-navy hover:text-deco-brass transition-colors underline decoration-deco-brass decoration-2 underline-offset-4">
                生成简历
              </Link>
            </div>
            <AnalysisResult key={renderKey} result={state.result} />
          </>
        )}
      </div>

      <footer className="text-center pt-16 text-xs text-deco-warmgray font-medium">
        <div className="deco-divider max-w-[200px] mx-auto mb-4">
          <div className="deco-diamond" />
        </div>
        AI 简历分析器 &mdash; 由 DeepSeek 驱动
      </footer>
    </main>
  );
}
