import React, { useEffect, useState } from "react";
import {
  financeService,
  type FinancialSummary,
} from "../../services/financeService";
import type { Settlement } from "../../types/payment";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { MetricCard } from "../../components/ui/MetricCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { useAuth } from "../auth/AuthContext";
import {
  Landmark,
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle,
  Banknote,
} from "lucide-react";

export const FinancePage: React.FC = () => {
  const { admin } = useAuth();

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSettlement, setSelectedSettlement] =
    useState<Settlement | null>(null);
  const [isDisburseOpen, setIsDisburseOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sumData, setList] = await Promise.all([
        financeService.getFinancialSummary(),
        financeService.getSettlements(),
      ]);
      setSummary(sumData);
      setSettlements(setList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDisburse = async () => {
    if (!selectedSettlement) return;
    await financeService.disburseSettlement(
      selectedSettlement.id,
      admin?.name || "Admin",
    );
    setIsDisburseOpen(false);
    setActionSuccess(
      `Settlement #${selectedSettlement.id} successfully disbursed!`,
    );
    loadData();
  };

  const columns: Column<Settlement>[] = [
    {
      header: "Settlement ID",
      accessor: (s) => (
        <span className="font-mono font-bold text-slate-900">#{s.id}</span>
      ),
    },
    {
      header: "Partner Name",
      accessor: (s) => (
        <span className="font-bold text-slate-900">{s.partnerName}</span>
      ),
    },
    {
      header: "Completed Jobs",
      accessor: (s) => (
        <span className="text-xs font-semibold text-slate-800">
          {s.completedJobs} jobs
        </span>
      ),
    },
    {
      header: "Gross Amount",
      accessor: (s) => (
        <span className="text-xs font-mono text-slate-500">
          ₹{s.grossAmount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Commission",
      accessor: (s) => (
        <span className="text-xs font-mono text-slate-500">
          ₹{s.commission.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Partner Payout",
      accessor: (s) => (
        <span className="font-bold text-emerald-600 font-heading">
          ₹{s.partnerAmount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (s) => <StatusBadge status={s.status} />,
    },
    {
      header: "Action",
      accessor: (s) =>
        s.status === "PENDING" ? (
          <button
            type="button"
            onClick={() => {
              setSelectedSettlement(s);
              setIsDisburseOpen(true);
            }}
            className="px-3 py-1 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1"
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Disburse Payout</span>
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-blue-600" />
          <span>Finance, GMV & Escrow Settlements</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track platform gross merchandise value, take rates, commissions and
          partner disbursement ledger
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Gross GMV"
            value={`₹${summary.grossGMV.toLocaleString("en-IN")}`}
            subtitle="Platform transaction volume"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <MetricCard
            title="Platform Net Revenue"
            value={`₹${summary.platformRevenue.toLocaleString("en-IN")}`}
            subtitle="~15% marketplace commission"
            icon={<DollarSign className="w-4 h-4" />}
          />
          <MetricCard
            title="Disbursed Payouts"
            value={`₹${summary.partnerPayoutsPaid.toLocaleString("en-IN")}`}
            subtitle="Settled to bank accounts"
            icon={<CheckCircle className="w-4 h-4" />}
          />
          <MetricCard
            title="Escrow Pending"
            value={`₹${summary.partnerPayoutsPending.toLocaleString("en-IN")}`}
            subtitle="Current cycle payout pool"
            icon={<CreditCard className="w-4 h-4" />}
          />
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Partner Escrow Settlement Cycles
        </h2>

        <DataTable
          columns={columns}
          data={settlements}
          keyExtractor={(s) => s.id}
          isLoading={isLoading}
        />
      </div>

      <ConfirmationDialog
        isOpen={isDisburseOpen}
        onClose={() => setIsDisburseOpen(false)}
        onConfirm={handleDisburse}
        title={`Disburse Settlement #${selectedSettlement?.id}`}
        message={`Authorize direct bank transfer of ₹${selectedSettlement?.partnerAmount.toLocaleString("en-IN")} to ${selectedSettlement?.partnerName}?`}
        confirmLabel="Authorize Transfer"
      />
    </div>
  );
};
