import { getToken } from "@/services/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  ats_compatibility: string;
  missing_keywords: string[];
  improvement_suggestions: string[];
  optimized_resume: string;
}

export interface HistoryItem {
  id: number;
  filename: string;
  file_size: number;
  created_at: string;
  analysis_count: number;
}

export interface HistoryDetail {
  id: number;
  filename: string;
  file_size: number;
  raw_text: string;
  created_at: string;
  analysis: (AnalysisResult & { id: number; created_at: string }) | null;
}

export async function uploadResume(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const res = await fetch(`${API}/api/upload`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: token } : {},
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "上传失败" }));
    throw new Error(err.detail || "上传失败");
  }
  return res.json();
}

export async function fetchHistory(skip = 0, limit = 20): Promise<HistoryItem[]> {
  const token = getToken();
  const res = await fetch(`${API}/api/history?skip=${skip}&limit=${limit}`, {
    headers: { Authorization: token || "" },
  });
  if (!res.ok) throw new Error("获取历史失败");
  return res.json();
}

export async function fetchHistoryDetail(id: number): Promise<HistoryDetail> {
  const token = getToken();
  const res = await fetch(`${API}/api/history/${id}`, {
    headers: { Authorization: token || "" },
  });
  if (!res.ok) throw new Error("获取详情失败");
  return res.json();
}

export async function deleteHistory(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API}/api/history/${id}`, {
    method: "DELETE",
    headers: { Authorization: token || "" },
  });
  if (!res.ok) throw new Error("删除失败");
}
