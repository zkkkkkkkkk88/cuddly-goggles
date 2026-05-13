import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantBorder = {
  default: "",
  success: "border-l-2 border-l-green-500",
  warning: "border-l-2 border-l-amber-500",
  danger: "border-l-2 border-l-red-400",
};

export default function SectionCard({ title, icon, children, variant = "default" }: SectionCardProps) {
  return (
    <div className={`bg-white border border-ink-200 rounded-lg p-6 ${variantBorder[variant]} animate-enter`}>
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-ink-400">{icon}</span>}
        <h3 className="font-semibold text-ink-900 text-xs uppercase tracking-widest">
          {title}
        </h3>
      </div>
      <div className="text-ink-700 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
