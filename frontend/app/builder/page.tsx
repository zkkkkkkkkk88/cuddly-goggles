"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Printer, FileText, Check, Loader2 } from "lucide-react";
import BuilderForm from "@/components/BuilderForm";
import ResumeTemplate from "@/components/ResumeTemplate";
import SwissTemplate from "@/components/SwissTemplate";
import LuxuryTemplate from "@/components/LuxuryTemplate";
import WabiSabiTemplate from "@/components/WabiSabiTemplate";
import { defaultResumeData, ResumeData } from "@/lib/builder-data";
import { fetchProfile, saveProfile } from "@/lib/profile-api";

type Tab = "edit" | "preview";

export default function BuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "edit";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [template, setTemplate] = useState<"deco" | "swiss" | "luxury" | "wabisabi">("deco");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved profile on mount
  useEffect(() => {
    fetchProfile().then(profile => {
      if (profile && Object.keys(profile).length > 0) {
        setData(prev => ({
          ...prev,
          ...profile,
          skills: profile.skills || [],
          workExperience: profile.workExperience || [],
          projects: profile.projects || [],
          honors: profile.honors || [],
        }));
      }
      setLoaded(true);
    });
  }, []);

  // Auto-save with debounce
  const debouncedSave = useCallback((newData: ResumeData) => {
    setSaving("saving");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveProfile(newData).then(() => {
        setSaving("saved");
        setTimeout(() => setSaving("idle"), 2000);
      }).catch(() => setSaving("idle"));
    }, 1500);
  }, []);

  const handleChange = (newData: ResumeData) => {
    setData(newData);
    debouncedSave(newData);
  };

  const handlePrint = () => window.print();

  const handleExportWord = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    const res = await fetch(`${API}/api/export-docx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, template }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.docx";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-deco-cream">
      {/* Top bar */}
      <div className="border-b border-deco-brass/20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-bold text-deco-warmgray hover:text-deco-navy transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回
          </button>

          {/* Tabs */}
          <div className="flex gap-1 bg-deco-pearl rounded p-0.5">
            <button
              onClick={() => setTab("edit")}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${tab === "edit" ? "bg-deco-navy text-deco-cream" : "text-deco-warmgray hover:text-deco-navy"}`}
            >
              在线简历
            </button>
            <button
              onClick={() => setTab("preview")}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${tab === "preview" ? "bg-deco-navy text-deco-cream" : "text-deco-warmgray hover:text-deco-navy"}`}
            >
              导出简历
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Save indicator */}
            {saving === "saving" && (
              <span className="flex items-center gap-1 text-[10px] text-deco-warmgray">
                <Loader2 className="w-3 h-3 animate-spin" /> 保存中
              </span>
            )}
            {saving === "saved" && (
              <span className="flex items-center gap-1 text-[10px] text-deco-sage">
                <Check className="w-3 h-3" /> 已保存
              </span>
            )}
            {tab === "preview" && (
              <div className="flex items-center gap-2">
                <button onClick={handleExportWord} className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold border border-deco-navy text-deco-navy hover:bg-deco-navy hover:text-deco-cream transition-colors">
                  <FileText className="w-4 h-4" /> 导出 Word
                </button>
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold bg-deco-navy text-deco-cream hover:bg-deco-brass hover:text-deco-navy transition-colors">
                  <Printer className="w-4 h-4" /> 导出 PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab content */}
      {tab === "edit" ? (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded p-6 border border-deco-warmgray/15" style={{ boxShadow: "4px 4px 0 0 rgba(200,169,81,0.08)" }}>
            <BuilderForm data={data} onChange={handleChange} />
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          {/* Template selector */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-deco-warmgray mr-2">选择模板</span>
            {(["deco", "swiss", "luxury", "wabisabi"] as const).map(t => (
              <button key={t} onClick={() => setTemplate(t)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${template === t ? "bg-deco-navy text-deco-cream" : "text-deco-warmgray hover:text-deco-navy border border-deco-warmgray/20"}`}>
                {{deco: "Art Deco", swiss: "Swiss 科技", luxury: "Luxury 金融", wabisabi: "侘寂 文创"}[t]}
              </button>
            ))}
          </div>

          {/* Selected template */}
          <div className="flex justify-center">
            <div className="bg-white shadow-lg" style={{ maxWidth: "210mm" }}>
              {template === "deco" && <ResumeTemplate data={data} />}
              {template === "swiss" && <SwissTemplate data={data} />}
              {template === "luxury" && <LuxuryTemplate data={data} />}
              {template === "wabisabi" && <WabiSabiTemplate data={data} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
