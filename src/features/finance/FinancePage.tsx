import React, { useEffect, useState } from "react";
import {
  financeService,
  type FinancialSummary,
} from "../../services/financeService";
import type { Settlement, PGCommissionRecord } from "../../types/payment";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { MetricCard } from "../../components/ui/MetricCard";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { useAuth } from "../auth/AuthContext";
import {
  Landmark,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Home,
  Wrench,
} from "lucide-react";

export const FinancePage: React.FC = () => {
  const { admin } = useAuth();

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [pgCommissions, setPgCommissions] = useState<PGCommissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"SETTLEMENTS" | "PG_COMMISSIONS">(
    "SETTLEMENTS",
  );
  const [selectedSettlementId, setSelectedSettlementId] = useState<
    string | null
  >(null);
  const [actionSuccess, setActionSuccess] = useState("");

  const loadFinanceData = async () => {
    setIsLoading(true);
    try {
      const [sum, setts, comms] = await Promise.all([
        financeService.getFinancialSummary(),
        financeService.getSettlements("ALL"),
        financeService.getPGCommissions(),
      ]);
      setSummary(sum);
      setSettlements(setts);
      setPgCommissions(comms);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  const handleDisburse = async () => {
    if (!selectedSettlementId) return;
    try {
      await financeService.disburseSettlement(
        selectedSettlementId,
        admin?.name || "Super Admin",
      );
      setActionSuccess("Settlement payout disbursed successfully.");
      setSelectedSettlementId(null);
      loadFinanceData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Disbursement failed");
    }
  };

  const handleCollectPGCommission = async (commId: string) => {
    try {
      await financeService.markPGCommissionCollected(
        commId,
        admin?.name || "Super Admin",
      );
      setActionSuccess("PG Commission marked as collected.");
      loadFinanceData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to mark commission");
    }
  };

  const settlementColumns: Column<Settlement>[] = [
    {
      header: "Settlement ID",
      accessor: (s) => (
        <span className="font-mono text-xs font-semibold">{s.id}</span>
      ),
    },
    {
      header: "Partner Name",
      accessor: (s) => (
        <span className="font-bold text-slate-800 text-xs">
          {s.partnerName}
        </span>
      ),
    },
    {
      header: "Completed Jobs",
      accessor: (s) => (
        <span className="text-xs font-semibold text-slate-700">
          {s.completedJobs} Jobs
        </span>
      ),
    },
    {
      header: "Gross GMV",
      accessor: (s) => (
        <span className="text-xs text-slate-800">
          ₹{s.grossAmount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Platform Cut",
      accessor: (s) => (
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
          ₹{s.commission.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Net Partner Payout",
      accessor: (s) => (
        <span className="font-bold text-xs text-emerald-700">
          ₹{s.partnerAmount.toLocaleString()}
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
            onClick={() => setSelectedSettlementId(s.id)}
            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
          >
            Disburse Payout
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">
            {s.settlementDate}
          </span>
        ),
    },
  ];

  const pgCommissionColumns: Column<PGCommissionRecord>[] = [
    {
      header: "Invoice & ID",
      accessor: (c) => (
        <div>
          <span className="font-mono text-xs font-semibold text-blue-600">
            {c.invoiceNumber || c.id}
          </span>
          <div className="text-[11px] text-slate-500 mt-0.5">{c.createdAt}</div>
        </div>
      ),
    },
    {
      header: "Property & Host",
      accessor: (c) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs">
            {c.propertyName}
          </div>
          <div className="text-[11px] text-slate-500">Owner: {c.ownerName}</div>
        </div>
      ),
    },
    {
      header: "Resident Move-In",
      accessor: (c) => (
        <span className="font-medium text-slate-700 text-xs">{c.userName}</span>
      ),
    },
    {
      header: "Monthly Rent",
      accessor: (c) => (
        <span className="text-xs font-semibold">
          ₹{c.monthlyRent.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Commission Rate",
      accessor: (c) => (
        <span className="text-xs text-slate-600">
          {c.commissionType === "PERCENTAGE"
            ? `${c.commissionRate}%`
            : `Fixed ₹${c.commissionRate}`}
        </span>
      ),
    },
    {
      header: "Total Receivable (+18% GST)",
      accessor: (c) => (
        <span className="font-bold text-xs text-emerald-700">
          ₹{c.totalReceivable.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (c) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            c.status === "COLLECTED"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {c.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (c) =>
        c.status !== "COLLECTED" ? (
          <button
            onClick={() => handleCollectPGCommission(c.id)}
            className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
          >
            Mark Collected
          </button>
        ) : (
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Collected
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-blue-600" />
            <span>Multi-Marketplace Finance & Settlements</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Service marketplace gross settlements, platform take-rate cuts, and
            PG move-in joining commissions.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Gross Platform GMV"
          value={`₹${(summary?.grossGMV || 0).toLocaleString()}`}
          subtitle="+14% this month"
          icon={<DollarSign className="w-4 h-4 text-blue-600" />}
        />
        <MetricCard
          title="Total Platform Revenue"
          value={`₹${(summary?.totalPlatformRevenue || 0).toLocaleString()}`}
          subtitle="Services + PG Joins"
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />
        <MetricCard
          title="Disbursed Payouts"
          value={`₹${(summary?.partnerPayoutsPaid || 0).toLocaleString()}`}
          subtitle="Paid to technicians"
          icon={<Landmark className="w-4 h-4 text-slate-600" />}
        />
        <MetricCard
          title="Pending Partner Payouts"
          value={`₹${(summary?.partnerPayoutsPending || 0).toLocaleString()}`}
          subtitle="Awaiting disbursement"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
        />
      </div>

      {/* Domain Switcher Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab("SETTLEMENTS")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "SETTLEMENTS"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Service Settlements Ledger ({settlements.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("PG_COMMISSIONS")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "PG_COMMISSIONS"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>PG Joining Commissions ({pgCommissions.length})</span>
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === "SETTLEMENTS" && (
        <DataTable
          data={settlements}
          columns={settlementColumns}
          keyExtractor={(s) => s.id}
          isLoading={isLoading}
          emptyMessage="No settlement records found."
        />
      )}

      {activeTab === "PG_COMMISSIONS" && (
        <DataTable
          data={pgCommissions}
          columns={pgCommissionColumns}
          keyExtractor={(c) => c.id}
          isLoading={isLoading}
          emptyMessage="No PG joining commission invoices generated yet."
        />
      )}

      {/* Confirmation Dialog for Disbursement */}
      <ConfirmationDialog
        isOpen={!!selectedSettlementId}
        onClose={() => setSelectedSettlementId(null)}
        onConfirm={handleDisburse}
        title="Execute Partner Settlement Payout"
        message="Authorize instant IMPS bank payout transfer to partner's registered bank account?"
        confirmLabel="Authorize Payout"
        isDestructive={false}
      />
    </div>
  );
};
