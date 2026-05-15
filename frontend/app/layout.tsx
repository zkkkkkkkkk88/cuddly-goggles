import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 简历分析 — 即时反馈与优化",
  description: "上传 PDF 简历，即刻获得 AI 评分、ATS 检测、关键词建议与优化版本。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-deco-cream text-deco-ink antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
