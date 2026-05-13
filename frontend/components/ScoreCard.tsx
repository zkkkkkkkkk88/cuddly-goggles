interface ScoreCardProps {
  score: number;
}

function scoreMeta(score: number) {
  if (score >= 80) return { ring: "#16a34a", text: "text-green-700", label: "优秀", bg: "bg-green-50" };
  if (score >= 60) return { ring: "#d97706", text: "text-amber-700", label: "良好", bg: "bg-amber-50" };
  return { ring: "#dc2626", text: "text-red-600", label: "需要改进", bg: "bg-red-50" };
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const m = scoreMeta(score);

  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);

  return (
    <div className={`rounded-lg ${m.bg} p-10 text-center animate-enter`}>
      <p className="text-xs font-medium text-ink-400 uppercase tracking-widest mb-6">
        AI 评分
      </p>

      <div className="relative inline-flex items-center justify-center">
        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="none" strokeWidth="8" className="stroke-ink-200" />
          <circle
            cx="64" cy="64" r={r} fill="none" strokeWidth="8"
            strokeLinecap="round"
            stroke={m.ring}
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold tracking-tight ${m.text}`}>{score}</span>
          <span className="text-xs text-ink-400 mt-0.5">/ 100</span>
        </div>
      </div>

      <p className={`mt-5 text-lg font-semibold ${m.text}`}>{m.label}</p>
    </div>
  );
}
