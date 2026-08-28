import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300/90 transition-all duration-200 flex flex-col justify-between group ${className}`}
    >
      {/* Top row: Title and Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100">
            {icon}
          </div>
        )}
      </div>

      {/* Main Stat Value */}
      <div className="mt-3">
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
      </div>

      {/* Subtitle & Trend Chip */}
      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] flex-wrap">
          {trend && (
            <span
              className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-md text-[10px] ${
                trend.isPositive
                  ? "text-emerald-700 bg-emerald-50 border border-emerald-200/80"
                  : "text-rose-700 bg-rose-50 border border-rose-200/80"
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
          {subtitle && (
            <span className="text-slate-400 font-medium">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
