import React from "react";

interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (val: string) => void;
}

interface FilterBarProps {
  groups: FilterGroup[];
  onReset?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  groups,
  onReset,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {groups.map((group) => (
        <div
          key={group.id}
          className="flex items-center gap-1.5 bg-slate-50/70 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs"
        >
          <span className="text-xs font-semibold text-slate-400">
            {group.label}:
          </span>
          <select
            value={group.value}
            onChange={(e) => group.onChange(e.target.value)}
            aria-label={group.label}
            className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
          >
            {group.options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-white text-slate-900"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
