import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { disputeService } from "../../services/disputeService";
import type { Dispute, DisputeStatus } from "../../types/dispute";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { FilterBar, type FilterGroup } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { PriorityBadge } from "../../components/ui/PriorityBadge";
import { Modal } from "../../components/ui/Modal";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { useAuth } from "../auth/AuthContext";
import { AlertOctagon, CheckCircle } from "lucide-react";

export const DisputesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { admin } = useAuth();

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusParam = searchParams.get("status") || "ALL";

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await disputeService.getDisputes(
        statusParam as DisputeStatus | "ALL",
      );
      setDisputes(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleResolve = async () => {
    if (!selectedDispute) return;
    await disputeService.resolveDispute(
      selectedDispute.id,
      resolutionText || "Arbitration settled by admin operations",
      admin?.name || "Admin",
    );
    setIsResolveOpen(false);
    setResolutionText("");
    setActionSuccess(`Dispute #${selectedDispute.id} marked as RESOLVED.`);
    loadData();
  };

  const handleEscalate = async (reason: string) => {
    if (!selectedDispute) return;
    await disputeService.escalateDispute(
      selectedDispute.id,
      reason,
      admin?.name || "Admin",
    );
    setIsEscalateOpen(false);
    setActionSuccess(
      `Dispute #${selectedDispute.id} ESCALATED to Legal/Management.`,
    );
    loadData();
  };

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Dispute Status",
      value: statusParam,
      options: [
        { label: "All Disputes", value: "ALL" },
        { label: "Open", value: "OPEN" },
        { label: "Under Review", value: "UNDER_REVIEW" },
        { label: "Escalated", value: "ESCALATED" },
        { label: "Resolved", value: "RESOLVED" },
      ],
      onChange: (v) => {
        const next = new URLSearchParams(searchParams);
        if (v === "ALL") next.delete("status");
        else next.set("status", v);
        setSearchParams(next);
      },
    },
  ];

  const columns: Column<Dispute>[] = [
    {
      header: "Dispute ID",
      accessor: (d) => (
        <div>
          <span className="font-mono font-bold text-slate-900">#{d.id}</span>
          <p className="text-[11px] text-slate-400 font-mono">
            Booking #{d.bookingId}
          </p>
        </div>
      ),
    },
    {
      header: "Customer vs Partner",
      accessor: (d) => (
        <div>
          <p className="font-bold text-slate-900">{d.customerName}</p>
          <p className="text-[11px] text-slate-400">vs {d.partnerName}</p>
        </div>
      ),
    },
    {
      header: "Category / Reason",
      accessor: (d) => (
        <div>
          <p className="font-semibold text-slate-900">
            {d.category.replace(/_/g, " ")}
          </p>
          <p className="text-[11px] text-slate-500 truncate max-w-xs">
            {d.description}
          </p>
        </div>
      ),
    },
    {
      header: "Priority",
      accessor: (d) => <PriorityBadge priority={d.priority} />,
    },
    {
      header: "SLA Age",
      accessor: (d) => (
        <span className="text-xs text-slate-500 font-mono">
          {d.ageInHours}h / {d.slaHours}h
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (d) => <StatusBadge status={d.status} />,
    },
    {
      header: "Actions",
      accessor: (d) =>
        d.status !== "RESOLVED" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedDispute(d);
                setIsResolveOpen(true);
              }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
            >
              Resolve
            </button>
            {d.status !== "ESCALATED" && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDispute(d);
                  setIsEscalateOpen(true);
                }}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200 transition-colors"
              >
                Escalate
              </button>
            )}
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-blue-600" />
            <span>Dispute Arbitration & Resolution</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mediate service quality, damage claims, billing disputes and legal
            escalations
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="flex items-center justify-between bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs">
        <FilterBar
          groups={filterGroups}
          onReset={() => setSearchParams(new URLSearchParams())}
        />
      </div>

      <DataTable
        columns={columns}
        data={disputes}
        keyExtractor={(d) => d.id}
        isLoading={isLoading}
      />

      {/* Resolve Modal */}
      <Modal
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        title={`Resolve Dispute #${selectedDispute?.id}`}
        subtitle={`Claim: ${selectedDispute?.customerName} vs ${selectedDispute?.partnerName}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Arbitration Ruling & Resolution Justification
            </label>
            <textarea
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              rows={3}
              placeholder="State the arbitration decision (e.g. 50% partial refund granted, partner penalized)..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsResolveOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleResolve}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              Confirm Settlement
            </button>
          </div>
        </div>
      </Modal>

      {/* Escalate Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isEscalateOpen}
        onClose={() => setIsEscalateOpen(false)}
        onConfirm={handleEscalate}
        title={`Escalate Dispute #${selectedDispute?.id}`}
        message="Escalate this dispute directly to Tier-3 Executive Management & Legal counsel?"
        requireReason={true}
        reasonPlaceholder="Specify justification for escalation (e.g. Major property damage, customer threat of legal action)..."
        confirmLabel="Escalate Dispute"
        isDestructive={true}
      />
    </div>
  );
};
