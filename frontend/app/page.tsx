"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import AnalysisResult from "@/components/AnalysisResult";
import HistoryPanel from "@/components/HistoryPanel";
import { runAnalysis, AnalysisState } from "@/services/analyze";
import { isLoggedIn, logout } from "@/services/auth";
import { AnalysisResult as AnalysisResultType } from "@/lib/api";
import { FileText, Edit3, History, LogOut, Sparkles } from "lucide-react";

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
    <div className="flex min-h-screen">
      {/* ====== Left Sidebar ====== */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-deco-navy text-white flex flex-col z-40">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-deco-brass" />
            <span className="text-sm font-black tracking-wide">Resume AI</span>
          </div>
          <p className="text-[10px] text-deco-warmgray/60">简历分析与生成平台</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          <div className="px-3 py-2 rounded text-sm font-bold text-deco-brass bg-deco-brass/10 flex items-center gap-2.5">
            <FileText className="w-4 h-4" /> 上传分析
          </div>

          <Link href="/builder"
            className="block px-3 py-3 mt-3 rounded border-2 border-deco-brass text-deco-brass hover:bg-deco-brass hover:text-deco-navy transition-all group">
            <div className="flex items-center gap-2.5 mb-1">
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-black">生成简历</span>
            </div>
            <p className="text-[10px] text-deco-brass/60 group-hover:text-deco-navy/60 leading-tight">
              在线编辑 · 模板预览 · 导出 PDF
            </p>
          </Link>
        </nav>

        {/* User + actions */}
        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          {user && (
            <>
              <p className="px-3 text-[10px] text-deco-warmgray/50 truncate">{user}</p>
              <button onClick={() => setShowHistory(true)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-deco-warmgray hover:text-white hover:bg-white/5 transition-colors">
                <History className="w-3.5 h-3.5" /> 历史记录
              </button>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-deco-warmgray hover:text-deco-rose hover:bg-white/5 transition-colors">
                <LogOut className="w-3.5 h-3.5" /> 退出登录
              </button>
            </>
          )}
        </div>
      </aside>

      {/* ====== Main Content (offset by sidebar) ====== */}
      <main className="flex-1 ml-56 pb-24">
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
                <Link href="/builder" className="text-sm font-bold text-deco-navy hover:text-deco-brass transition-colors underline decoration-deco-brass decoration-2 underline-offset-4">
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

      {showHistory && <HistoryPanel onSelect={handleHistorySelect} onClose={() => setShowHistory(false)} />}
    </div>
  );
}
