"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Edit3, History, LogOut, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/services/auth";
import HistoryPanel from "@/components/HistoryPanel";
import { AnalysisResult } from "@/lib/api";

interface Props { children: React.ReactNode; }

export default function AppShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setUserEmail(localStorage.getItem("resume_ai_email"));
  }, []);

  // Don't show sidebar on login page
  if (pathname === "/login") return <>{children}</>;

  const handleLogout = () => {
    logout();
    localStorage.removeItem("resume_ai_email");
    sessionStorage.removeItem("last_analysis");
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-deco-navy text-white flex flex-col z-40">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-deco-brass" />
            <span className="text-sm font-black tracking-wide">Resume AI</span>
          </div>
          <p className="text-[10px] text-deco-warmgray/60">简历分析与生成平台</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1.5">
          <Link href="/"
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-bold transition-all ${pathname === "/" ? "text-deco-brass bg-deco-brass/10" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
            <FileText className="w-4 h-4" /> 简历分析
          </Link>
          <Link href="/builder?tab=edit"
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-bold transition-all ${pathname === "/builder" ? "text-deco-brass bg-deco-brass/10" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
            <Edit3 className="w-4 h-4" /> 在线简历
          </Link>
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/10 space-y-2" suppressHydrationWarning>
          {userEmail && (
            <>
              <p className="px-3 text-[10px] text-deco-warmgray/50 truncate">{userEmail}</p>
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

      {/* Main content area */}
      <div className="flex-1 ml-56">
        {children}
      </div>

      {/* History panel overlay */}
      {showHistory && (
        <HistoryPanel
          onSelect={(result) => {
            setShowHistory(false);
            sessionStorage.setItem("last_analysis", JSON.stringify(result));
            window.location.href = "/";
          }}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
