"use client";

import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  accent?: "brass" | "sage" | "rose";
}

const accentColors = {
  brass: { border: "#c8a951", bg: "rgba(200,169,81,0.04)" },
  sage: { border: "#8aa79c", bg: "rgba(138,167,156,0.04)" },
  rose: { border: "#c08081", bg: "rgba(192,128,129,0.04)" },
};

export default function SectionCard({ title, icon, children, accent = "brass" }: SectionCardProps) {
  const c = accentColors[accent];

  return (
    <div
      className="bg-white p-6 gold-leaf animate-enter"
      style={{
        borderLeft: `3px solid ${c.border}`,
        background: `linear-gradient(135deg, ${c.bg} 0%, white 30%)`,
        boxShadow: "0 1px 3px rgba(26,39,68,0.06)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-deco-warmgray">{icon}</span>}
        <h3 className="font-bold text-deco-navy text-xs uppercase tracking-[0.25em]"
          style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
          {title}
        </h3>
      </div>
      <div className="text-deco-ink/80 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
