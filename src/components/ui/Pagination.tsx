import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomSelect } from "./CustomSelect";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className = "",
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageSizeOptions = [
    { label: "10 rows", value: "10" },
    { label: "25 rows", value: "25" },
    { label: "50 rows", value: "50" },
  ];

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 py-3 px-1 text-xs text-slate-500 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span>
          Showing{" "}
          <span className="font-semibold text-slate-800">{startItem}</span> to{" "}
          <span className="font-semibold text-slate-800">{endItem}</span> of{" "}
          <span className="font-semibold text-slate-800">{totalItems}</span>{" "}
          results
        </span>
        {onPageSizeChange && (
          <div className="ml-3 flex items-center gap-1.5 w-28">
            <CustomSelect
              options={pageSizeOptions}
              value={String(pageSize)}
              onChange={(val) => onPageSizeChange(Number(val))}
              size="sm"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2.5 font-bold text-slate-700">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
