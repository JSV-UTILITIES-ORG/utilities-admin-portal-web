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
  let breached = isBreached ?? false;
  let text = "";
  let subtext = "";

  if (limitMinutes !== undefined && elapsedMinutes !== undefined) {
    if (elapsedMinutes >= limitMinutes) breached = true;
    const remaining = limitMinutes - elapsedMinutes;
    if (breached) {
      text = `Breached by ${elapsedMinutes - limitMinutes}m`;
      subtext = `${elapsedMinutes}m / ${limitMinutes}m`;
    } else {
      text = `${remaining}m left`;
      subtext = `${elapsedMinutes}m / ${limitMinutes}m`;
    }
  } else if (limitHours !== undefined && elapsedHours !== undefined) {
    if (elapsedHours >= limitHours) breached = true;
    const remaining = (limitHours - elapsedHours).toFixed(1);
    if (breached) {
      text = `Breached by ${(elapsedHours - limitHours).toFixed(1)}h`;
      subtext = `${elapsedHours.toFixed(1)}h / ${limitHours}h`;
    } else {
      text = `${remaining}h remaining`;
      subtext = `${elapsedHours.toFixed(1)}h / ${limitHours}h`;
    }
  }

  if (breached) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 animate-pulse" />
        <div className="flex flex-col">
          <span className="font-bold text-red-700">🔴 SLA BREACHED</span>
          {subtext && (
            <span className="text-[10px] text-red-600 font-medium">
              {subtext}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-xs ${className}`}
    >
      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <div className="flex flex-col">
        <span className="font-medium text-slate-900">
          {text || "Within SLA"}
        </span>
        {subtext && (
          <span className="text-[10px] text-slate-500 font-mono">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
