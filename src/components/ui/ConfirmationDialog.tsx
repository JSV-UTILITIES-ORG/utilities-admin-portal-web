import React, { useState } from "react";
import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  requireReason?: boolean;
  reasonPlaceholder?: string;
  isDestructive?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  requireReason = false,
  reasonPlaceholder = "Please specify rationale for this sensitive operational override...",
  isDestructive = false,
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (requireReason && !reason.trim()) {
      setError(
        "A mandatory reason is required for compliance and audit logging.",
      );
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      setReason("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div
            className={`p-2.5 rounded-lg shrink-0 ${
              isDestructive
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-700 leading-relaxed">{message}</p>
          </div>
        </div>

        {requireReason && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Audit Rationale / Justification{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              rows={3}
              placeholder={reasonPlaceholder}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-all shadow-xs active:scale-95 flex items-center gap-1.5 ${
              isDestructive
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
            }`}
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : null}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
