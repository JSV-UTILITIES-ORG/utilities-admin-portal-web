import React from "react";
import { Link } from "react-router-dom";

interface ActionCardProps {
  title: string;
  count: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  description?: string;
  actionLabel: string;
  actionRoute: string;
  affectedAmount?: number;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  count,
  severity,
  actionLabel,
  actionRoute,
}) => {
  const isCritical = severity === "CRITICAL";

  return (
    <Link
      to={actionRoute}
      className={`bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs transition-all duration-150 hover:shadow-md hover:border-slate-300 flex flex-col justify-between h-40 group relative ${
        isCritical
          ? "border-l-4 border-l-red-500"
          : "border-l-4 border-l-amber-500"
      }`}
    >
      {/* Top Row: Severity + Big Count */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isCritical ? "bg-red-500" : "bg-amber-500"
            }`}
          />
          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider ${
              isCritical ? "text-red-600" : "text-amber-600"
            }`}
          >
            {severity}
          </span>
        </div>

        <span className="text-3xl font-extrabold text-slate-900 font-heading leading-none">
          {count}
        </span>
      </div>

      {/* Middle: Title */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
      </div>

      {/* Bottom: Subtext + Link */}
      <div className="flex items-center justify-between text-xs pt-2">
        <span className="text-slate-400 text-[11px] font-medium">
          Direct to filtered queue
        </span>
        <span className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-0.5 text-xs transition-colors">
          {actionLabel} →
        </span>
      </div>
    </Link>
  );
};
