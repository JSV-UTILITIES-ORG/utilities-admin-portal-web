import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { paymentService } from "../../services/paymentService";
import type { Payment, PaymentStatus } from "../../types/payment";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { FilterBar, type FilterGroup } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../auth/AuthContext";
import { CreditCard, RefreshCw, CheckCircle } from "lucide-react";

export const PaymentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { admin } = useAuth();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState("");

  const statusParam = searchParams.get("status") || "ALL";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await paymentService.getPayments(
        statusParam as PaymentStatus | "ALL",
      );
      setPayments(data);
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

  const handleRetry = async (paymentId: string) => {
    await paymentService.retryPayment(paymentId, admin?.name || "Admin");
    setActionSuccess(`Payment #${paymentId} reconciled successfully!`);
    loadData();
  };

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Payment Status",
      value: statusParam,
      options: [
        { label: "All Payments", value: "ALL" },
        { label: "Payment Failed", value: "FAILED" },
        { label: "Completed", value: "SUCCESS" },
        { label: "Pending Gateway", value: "PENDING" },
        { label: "Refunded", value: "REFUNDED" },
      ],
      onChange: (v) => updateParam("status", v),
    },
  ];

  const columns: Column<Payment>[] = [
    {
      header: "Payment Reference",
      accessor: (p) => (
        <div>
          <p className="font-mono font-bold text-slate-900">
            {p.reference || p.id}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Booking #{p.bookingId}
          </p>
        </div>
      ),
    },
    {
      header: "Customer",
      accessor: (p) => (
        <span className="font-bold text-slate-900">{p.customerName}</span>
      ),
    },
    {
      header: "Amount",
      accessor: (p) => (
        <span className="font-bold text-slate-900 font-heading">
          ₹{p.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Payment Method",
      accessor: (p) => (
        <div className="text-xs font-mono text-slate-600 font-bold">
          {p.method}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (p) => <StatusBadge status={p.status} />,
    },
    {
      header: "Failure Reason / Created At",
      accessor: (p) => (
        <div className="text-xs">
          {p.failureReason ? (
            <span className="text-red-600 font-medium">{p.failureReason}</span>
          ) : (
            <span className="text-slate-400">{p.createdAt}</span>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (p) =>
        p.status === "FAILED" ? (
          <button
            type="button"
            onClick={() => handleRetry(p.id)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reconcile</span>
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Payments & Gateway Transactions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor transaction logs, failed checkout sessions, and gateway
            reconciliation
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
        data={payments}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
      />
    </div>
  );
};
