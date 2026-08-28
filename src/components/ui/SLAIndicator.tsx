import React from "react";
import { AlertCircle, Clock } from "lucide-react";

interface SLAIndicatorProps {
  elapsedMinutes?: number;
  limitMinutes?: number;
  elapsedHours?: number;
  limitHours?: number;
  isBreached?: boolean;
  className?: string;
}

export const SLAIndicator: React.FC<SLAIndicatorProps> = ({
  elapsedMinutes,
  limitMinutes,
  elapsedHours,
  limitHours,
  isBreached,
  className = "",
}) => {
  let isOverdue = isBreached ?? false;
  let text = "";
  let subtext = "";

  if (limitMinutes !== undefined && elapsedMinutes !== undefined) {
    if (elapsedMinutes >= limitMinutes) isOverdue = true;
    const remaining = limitMinutes - elapsedMinutes;
    if (isOverdue) {
      const overBy = elapsedMinutes - limitMinutes;
      text = `Overdue (+${overBy}m late)`;
      subtext = `Elapsed: ${elapsedMinutes}m / Max: ${limitMinutes}m`;
    } else {
      text = `${remaining}m remaining`;
      subtext = `Elapsed: ${elapsedMinutes}m / Max: ${limitMinutes}m`;
    }
  } else if (limitHours !== undefined && elapsedHours !== undefined) {
    if (elapsedHours >= limitHours) isOverdue = true;
    const remaining = Math.max(0, limitHours - elapsedHours).toFixed(1);
    if (isOverdue) {
      const overBy = (elapsedHours - limitHours).toFixed(1);
      text = `Overdue (+${overBy}h late)`;
      subtext = `Elapsed: ${elapsedHours.toFixed(1)}h / Max: ${limitHours}h`;
    } else {
      text = `${remaining}h remaining`;
      subtext = `Elapsed: ${elapsedHours.toFixed(1)}h / Max: ${limitHours}h`;
    }
  }

  if (isOverdue) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs shadow-2xs ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 animate-pulse" />
        <div className="flex flex-col text-left leading-tight">
          <span className="font-bold text-[11px] text-rose-700">
            {text || "OVERDUE (Late)"}
          </span>
          {subtext && (
            <span className="text-[10px] text-rose-600/80 font-medium">
              {subtext}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs shadow-2xs ${className}`}
    >
      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <div className="flex flex-col text-left leading-tight">
        <span className="font-bold text-[11px] text-slate-800">
          {text || "On Time"}
        </span>
        {subtext && (
          <span className="text-[10px] text-slate-500 font-medium">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
