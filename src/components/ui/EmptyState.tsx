import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isPositive?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  isPositive = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200 rounded-xl ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
          isPositive
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon ? (
          icon
        ) : isPositive ? (
          <CheckCircle2 className="w-6 h-6" />
        ) : (
          <AlertCircle className="w-6 h-6" />
        )}
      </div>
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 px-3.5 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
