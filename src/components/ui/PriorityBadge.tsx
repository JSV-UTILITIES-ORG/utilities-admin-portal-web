import React from "react";
import type { Priority } from "../../types/common";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className = "",
}) => {
  const getStyle = (p: Priority) => {
    switch (p) {
      case "CRITICAL":
        return "bg-red-50 text-red-700 border-red-200 font-bold";
      case "HIGH":
        return "bg-amber-50 text-amber-800 border-amber-200 font-semibold";
      case "MEDIUM":
        return "bg-blue-50 text-blue-700 border-blue-200 font-medium";
      case "LOW":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 font-medium";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${getStyle(
        priority,
      )} ${className}`}
    >
      {priority}
    </span>
  );
};
