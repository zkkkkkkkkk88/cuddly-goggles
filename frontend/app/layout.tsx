import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 简历分析 — 即时反馈与优化",
  description:
    "上传你的 PDF 简历，即刻获得 AI 驱动的评分、ATS 兼容性检测、关键词建议以及专业优化版本。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-paper text-ink-900 antialiased">
        {children}
      </body>
    </html>
  );
}
