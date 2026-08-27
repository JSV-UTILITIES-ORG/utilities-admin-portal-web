import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { refundService } from "../../services/refundService";
import type { Refund, RefundStatus } from "../../types/payment";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { FilterBar, type FilterGroup } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { useAuth } from "../auth/AuthContext";
import { RotateCcw, CheckCircle } from "lucide-react";

export const RefundsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { admin } = useAuth();

  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusParam = searchParams.get("status") || "ALL";

  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await refundService.getRefunds(
        statusParam as RefundStatus | "ALL",
      );
      setRefunds(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val === "ALL" || !val) next.delete(key);
    else next.set(key, val);
    setSearchParams(next);
  };

  const handleApprove = async () => {
    if (!selectedRefund) return;
    await refundService.approveRefund(
      selectedRefund.id,
      admin?.name || "Admin",
    );
    setIsApproveOpen(false);
    setActionSuccess(`Refund #${selectedRefund.id} approved for processing`);
    loadData();
  };

  const handleReject = async (reason: string) => {
    if (!selectedRefund) return;
    await refundService.rejectRefund(
      selectedRefund.id,
      reason,
      admin?.name || "Admin",
    );
    setIsRejectOpen(false);
    setActionSuccess(`Refund #${selectedRefund.id} rejected.`);
    loadData();
  };

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Refund Status",
      value: statusParam,
      options: [
        { label: "All Refunds", value: "ALL" },
        { label: "Requested", value: "REQUESTED" },
        { label: "Approved", value: "APPROVED" },
        { label: "Processed", value: "PROCESSED" },
        { label: "Rejected", value: "REJECTED" },
      ],
      onChange: (v) => updateParam("status", v),
    },
  ];

  const columns: Column<Refund>[] = [
    {
      header: "Refund ID",
      accessor: (r) => (
        <div>
          <p className="font-mono font-bold text-slate-900">#{r.id}</p>
          <p className="text-[11px] text-slate-400 font-mono">
            Booking #{r.bookingId}
          </p>
        </div>
      ),
    },
    {
      header: "Customer",
      accessor: (r) => (
        <span className="font-bold text-slate-900">{r.customerName}</span>
      ),
    },
    {
      header: "Refund Amount",
      accessor: (r) => (
        <span className="font-bold text-slate-900 font-heading">
          ₹{r.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Reason",
      accessor: (r) => (
        <span className="text-xs text-slate-600">{r.reason}</span>
      ),
    },
    {
      header: "Status",
      accessor: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: "Requested At",
      accessor: (r) => (
        <span className="text-xs text-slate-400 font-mono">
          {r.requestedAt}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (r) =>
        r.status === "REQUESTED" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedRefund(r);
                setIsApproveOpen(true);
              }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRefund(r);
                setIsRejectOpen(true);
              }}
              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 transition-colors"
            >
              Reject
            </button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            <span>Refund Claims & Approvals</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit customer cancellation refunds, service compensation and payout
            authorization
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
        data={refunds}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
      />

      <ConfirmationDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title={`Authorize Refund #${selectedRefund?.id}`}
        message={`Are you sure you want to approve refund of ₹${selectedRefund?.amount.toLocaleString("en-IN")} for ${selectedRefund?.customerName}?`}
        confirmLabel="Approve & Initiate Payout"
      />

      <ConfirmationDialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
        title={`Reject Refund #${selectedRefund?.id}`}
        message="Provide justification for rejecting this customer refund claim."
        requireReason={true}
        reasonPlaceholder="Specify reason for rejection (e.g. Service already completed successfully)..."
        confirmLabel="Reject Refund"
        isDestructive={true}
      />
    </div>
  );
};
