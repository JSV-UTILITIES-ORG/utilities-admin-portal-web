import React from "react";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "md",
}) => {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");

  const getStyle = (s: string) => {
    switch (s) {
      // Danger / Critical / Failed / Rejected / Overdue
      case "ASSIGNMENT_FAILED":
      case "PAYMENT_FAILED":
      case "REJECTED":
      case "SUSPENDED":
      case "CANCELLED":
      case "BREACHED":
      case "OVERDUE":
        return {
          container: "bg-rose-50 text-rose-700 border-rose-200",
          dot: "bg-rose-500",
        };

      // Urgent / Warning / Escalated / Disputed
      case "ESCALATED":
      case "DISPUTED":
      case "HIGH":
      case "WARNING":
      case "MORE_INFO_REQUIRED":
      case "ON_HOLD":
        return {
          container: "bg-amber-50 text-amber-800 border-amber-200",
          dot: "bg-amber-500",
        };

      // Pending / In Review
      case "PENDING":
      case "UNDER_REVIEW":
      case "SUBMITTED":
      case "AWAITING_ASSIGNMENT":
      case "PAYMENT_PENDING":
      case "REFUND_REQUESTED":
      case "REQUESTED":
        return {
          container: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500 animate-pulse",
        };

      // Contacted / Shortlisted / Processing
      case "CONTACTED":
      case "SHORTLISTED":
      case "PROCESSING":
      case "VISIT_SCHEDULED":
      case "SCHEDULED":
      case "INVOICED":
        return {
          container: "bg-violet-50 text-violet-700 border-violet-200",
          dot: "bg-violet-500",
        };

      // Active / Success / Completed
      case "ACTIVE":
      case "APPROVED":
      case "PUBLISHED":
      case "COMPLETED":
      case "PAYMENT_COMPLETED":
      case "SETTLED":
      case "RESOLVED":
      case "SUCCESS":
      case "OK":
      case "ACCEPTED":
      case "VERIFIED":
      case "ON_TIME":
        return {
          container: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };

      // In progress / Travelling / Arrived
      case "IN_PROGRESS":
      case "ASSIGNED":
      case "TRAVELLING":
      case "ARRIVED":
      case "ADDITIONAL_CHARGE_PENDING":
        return {
          container: "bg-indigo-50 text-indigo-700 border-indigo-200",
          dot: "bg-indigo-500",
        };

      // Inactive / Default / Closed
      case "INACTIVE":
      case "CLOSED":
      case "DRAFT":
      default:
        return {
          container: "bg-slate-100 text-slate-700 border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  const formatText = (txt: string) => {
    const upper = txt.toUpperCase();
    if (upper === "BREACHED") return "Overdue (Late)";
    if (upper === "WARNING") return "Urgent (Due Soon)";
    if (upper === "OK") return "On Time";
    if (upper === "ADDITIONAL_CHARGE_PENDING") return "Add-on Pending";
    return txt.replace(/_/g, " ");
  };

  const style = getStyle(normalized);
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide border shadow-2xs transition-colors ${style.container} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`}></span>
      <span className="capitalize">{formatText(status.toLowerCase())}</span>
    </span>
  );
};
