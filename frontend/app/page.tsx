"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import AnalysisResult from "@/components/AnalysisResult";
import HistoryPanel from "@/components/HistoryPanel";
import { runAnalysis, AnalysisState } from "@/services/analyze";
import { isLoggedIn, logout } from "@/services/auth";
import { AnalysisResult as AnalysisResultType } from "@/lib/api";
import { LogOut, History } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AnalysisState>({ stage: "idle" });
  const [showHistory, setShowHistory] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    } else {
      setUser(localStorage.getItem("resume_ai_email"));
    }
    setMounted(true);
  }, [router]);

  const handleFileSelect = useCallback((file: File) => {
    runAnalysis(file, (s) => { setState(s); if (s.stage === "done") setRenderKey(k => k + 1); });
  }, []);

  const handleReset = () => setState({ stage: "idle" });

  const handleLogout = () => {
    logout();
    localStorage.removeItem("resume_ai_email");
    router.replace("/login");
  };

  const handleHistorySelect = (result: AnalysisResultType) => {
    setShowHistory(false);
    setState({ stage: "done", result });
    setRenderKey(k => k + 1);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen pb-24">
      {/* User bar */}
      <div className="max-w-4xl mx-auto px-6 pt-4 flex justify-end items-center gap-3">
        {user && (
          <>
            <span className="text-xs font-bold text-deco-warmgray">{user}</span>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1 text-xs font-bold text-deco-navy hover:text-deco-brass transition-colors"
            >
              <History className="w-3 h-3" /> 历史
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-bold text-deco-warmgray hover:text-deco-rose transition-colors"
            >
              <LogOut className="w-3 h-3" /> 退出
            </button>
          </>
        )}
      </div>

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
            <div className="text-center mt-6 mb-2">
              <button onClick={handleReset} className="text-sm font-bold text-deco-navy hover:text-deco-brass transition-colors underline decoration-deco-brass decoration-2 underline-offset-4">
                分析另一份简历
              </button>
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

      {showHistory && <HistoryPanel onSelect={handleHistorySelect} onClose={() => setShowHistory(false)} />}
    </main>
  );
}
