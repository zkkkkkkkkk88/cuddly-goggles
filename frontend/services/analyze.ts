import { uploadResume, AnalysisResult } from "@/lib/api";

export type AnalysisState =
  | { stage: "idle" }
  | { stage: "uploading" }
  | { stage: "analyzing" }
  | { stage: "done"; result: AnalysisResult }
  | { stage: "error"; message: string };

export async function runAnalysis(
  file: File,
  lang: string,
  onStateChange: (state: AnalysisState) => void,
) {
  try {
    onStateChange({ stage: "uploading" });
    onStateChange({ stage: "analyzing" });

    const result = await uploadResume(file, lang);
    onStateChange({ stage: "done", result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    onStateChange({ stage: "error", message });
  }
}
