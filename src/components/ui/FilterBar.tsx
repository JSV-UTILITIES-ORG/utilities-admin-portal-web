import React from "react";
import { CustomSelect } from "./CustomSelect";
import { RotateCcw } from "lucide-react";

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
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {groups.map((group) => (
        <div key={group.id} className="min-w-[160px] max-w-xs">
          <CustomSelect
            options={group.options}
            value={group.value}
            onChange={group.onChange}
            size="sm"
            placeholder={group.label}
          />
        </div>
      ))}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors border border-slate-200 bg-white shadow-2xs"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
