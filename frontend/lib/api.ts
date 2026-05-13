const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  ats_compatibility: string;
  missing_keywords: string[];
  improvement_suggestions: string[];
  optimized_resume: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function uploadResume(file: File, lang: string): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lang", lang);

  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new ApiError(err.detail || "Upload failed", res.status);
  }

  return res.json();
}

