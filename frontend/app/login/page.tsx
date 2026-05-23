"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { login, register, isLoggedIn } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace("/");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fn = mode === "login" ? login : register;
      const result = await fn(email, password);
      localStorage.setItem("resume_ai_email", result.email);
      sessionStorage.removeItem("last_analysis");
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deco-cream flex items-center justify-center p-6">
      {/* Decorative background */}
      <div className="fixed top-20 left-10 w-32 h-32 border-4 border-deco-brass/10 rounded-full" />
      <div className="fixed bottom-32 right-16 w-24 h-24 border-4 border-deco-navy/5 rotate-45" />
      <div className="fixed top-1/3 right-10 w-2 h-2 bg-deco-brass/40" />
      <div className="fixed bottom-1/4 left-20 w-3 h-3 bg-deco-navy/15" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Top decorative line */}
        <div className="deco-divider max-w-[200px] mx-auto mb-8">
          <div className="deco-diamond" />
        </div>

        <div
          className="bg-white p-10 animate-enter"
          style={{ boxShadow: "8px 8px 0 0 rgba(200,169,81,0.15), 0 1px 3px rgba(26,39,68,0.06)" }}
        >
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-deco-brass/30 text-deco-brass text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3 h-3" />
              AI Resume Analyzer
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-black text-center text-deco-navy mb-2"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
          >
            {mode === "login" ? "欢迎回来" : "创建账号"}
          </h1>
          <p className="text-sm text-deco-warmgray text-center mb-10">
            {mode === "login" ? "登录以查看您的简历分析记录" : "注册后即可开始使用 AI 简历分析"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-deco-navy uppercase tracking-widest mb-2">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deco-warmgray" />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-deco-warmgray/30 bg-deco-pearl/30 text-deco-ink text-sm placeholder:text-deco-warmgray/40 outline-none focus:border-deco-brass transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-deco-navy uppercase tracking-widest mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deco-warmgray" />
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "至少 6 位" : "输入密码"}
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-deco-warmgray/30 bg-deco-pearl/30 text-deco-ink text-sm placeholder:text-deco-warmgray/40 outline-none focus:border-deco-brass transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-deco-rose text-xs font-bold bg-deco-rose/5 border border-deco-rose/20 p-3">
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-deco-navy text-deco-cream text-sm font-bold uppercase tracking-widest hover:bg-deco-brass hover:text-deco-navy transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                "处理中..."
              ) : (
                <>
                  {mode === "login" ? "登录" : "创建账号"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="mt-8 text-center text-xs text-deco-warmgray">
            {mode === "login" ? "还没有账号？" : "已有账号？"}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="ml-1 font-bold text-deco-brass hover:text-deco-navy transition-colors underline decoration-deco-brass/30 underline-offset-4"
            >
              {mode === "login" ? "立即注册" : "去登录"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
