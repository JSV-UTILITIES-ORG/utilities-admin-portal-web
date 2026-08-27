import React from "react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const getStyle = (st: string) => {
    switch (st.toUpperCase()) {
      // Critical / Failed / Rejected states
      case "FAILED":
      case "ASSIGNMENT_FAILED":
      case "PAYMENT_FAILED":
      case "REJECTED":
      case "SUSPENDED":
      case "CANCELLED":
      case "BREACHED":
        return "bg-red-50 text-red-700 border-red-200";

      // Urgent / Warning / Escalated / Disputed
      case "ESCALATED":
      case "DISPUTED":
      case "HIGH":
      case "WARNING":
      case "MORE_INFO_REQUIRED":
      case "ON_HOLD":
        return "bg-amber-50 text-amber-800 border-amber-200";

      // Pending / In Review
      case "PENDING":
      case "UNDER_REVIEW":
      case "AWAITING_ASSIGNMENT":
      case "REQUESTED":
      case "PROCESSING":
      case "APPLIED":
      case "UNASSIGNED":
      case "OPEN":
        return "bg-blue-50 text-blue-700 border-blue-200";

      // Active / Success / Completed
      case "ACTIVE":
      case "APPROVED":
      case "COMPLETED":
      case "PAYMENT_COMPLETED":
      case "SETTLED":
      case "RESOLVED":
      case "SUCCESS":
      case "OK":
      case "ACCEPTED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      // In progress
      case "IN_PROGRESS":
      case "ASSIGNED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      // Inactive / Default
      case "INACTIVE":
      case "CLOSED":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatText = (txt: string) => {
    return txt.replace(/_/g, " ");
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${getStyle(
        status,
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {formatText(status)}
    </span>
  );
};
