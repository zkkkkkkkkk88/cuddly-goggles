interface ScoreCardProps {
  score: number;
}

function scoreMeta(score: number) {
  if (score >= 80) return { color: "#8aa79c", label: "优秀" };
  if (score >= 60) return { color: "#d4af37", label: "良好" };
  return { color: "#c08081", label: "需要改进" };
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const m = scoreMeta(score);
  const r = 58;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);

  return (
    <div className="stepped-border bg-white p-10 text-center animate-enter">
      <p className="text-xs font-bold text-deco-warmgray uppercase tracking-[0.3em] mb-8">
        AI 评分
      </p>

      <div className="relative inline-flex items-center justify-center">
        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="none" strokeWidth="6" stroke="#e8e4db" />
          <circle
            cx="64" cy="64" r={r} fill="none" strokeWidth="6"
            strokeLinecap="round"
            stroke={m.color}
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-deco-navy">{score}</span>
          <span className="text-xs text-deco-warmgray mt-0.5">/ 100</span>
        </div>
      </div>

      <p className="mt-6 text-xl font-bold text-deco-navy"
        style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
        {m.label}
      </p>
    </div>
  );
}
