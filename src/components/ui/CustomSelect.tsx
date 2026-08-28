import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  searchable?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  label,
  disabled = false,
  className = "",
  size = "md",
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const filteredOptions = searchable
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opt.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : options;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs min-h-[30px]",
    md: "px-3 py-1.5 text-xs min-h-[36px]",
    lg: "px-3.5 py-2.5 text-sm min-h-[42px]",
  };

  return (
    <div
      className={`relative inline-block text-left w-full ${className}`}
      ref={dropdownRef}
    >
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-lg border transition-all duration-150 bg-white font-medium shadow-xs ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/10 text-slate-900"
            : "border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/50"
        } ${sizeClasses[size]} ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-100"
            : "cursor-pointer"
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 text-slate-500">
              {selectedOption.icon}
            </span>
          )}
          <span
            className={
              selectedOption ? "text-slate-900 font-semibold" : "text-slate-400"
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ml-2 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[160px] bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 animate-fadeIn max-h-60 overflow-y-auto">
          {searchable && options.length > 5 && (
            <div className="px-2 pb-1.5 border-b border-slate-100">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>
          )}

          <div className="space-y-0.5 px-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400 text-center">
                No matching options
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isSelected
                        ? "bg-blue-50/80 text-blue-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon && (
                        <span
                          className={`shrink-0 ${isSelected ? "text-blue-600" : "text-slate-400"}`}
                        >
                          {option.icon}
                        </span>
                      )}
                      <div>
                        <div className="truncate">{option.label}</div>
                        {option.description && (
                          <div className="text-[10px] text-slate-400 font-normal truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
