import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supportService } from "../../services/supportService";
import type { SupportTicket, TicketStatus } from "../../types/support";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { FilterBar, type FilterGroup } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { PriorityBadge } from "../../components/ui/PriorityBadge";
import { SLAIndicator } from "../../components/ui/SLAIndicator";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../auth/AuthContext";
import { Headphones, CheckCircle } from "lucide-react";

export const SupportPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { admin } = useAuth();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const slaParam = searchParams.get("sla") === "BREACHED";
  const statusParam = searchParams.get("status") || "ALL";

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [resolutionText, setResolutionText] = useState("");
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await supportService.getTickets(
        slaParam || undefined,
        statusParam as TicketStatus | "ALL",
      );
      setTickets(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleResolve = async () => {
    if (!selectedTicket) return;
    await supportService.resolveTicket(
      selectedTicket.id,
      resolutionText || "Issue resolved following customer verification",
      admin?.name || "Admin",
    );
    setIsResolveOpen(false);
    setResolutionText("");
    setActionSuccess(`Ticket #${selectedTicket.id} marked as RESOLVED.`);
    loadData();
  };

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Ticket Status",
      value: statusParam,
      options: [
        { label: "All Statuses", value: "ALL" },
        { label: "Open", value: "OPEN" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Resolved", value: "RESOLVED" },
        { label: "Closed", value: "CLOSED" },
      ],
      onChange: (v) => {
        const next = new URLSearchParams(searchParams);
        if (v === "ALL") next.delete("status");
        else next.set("status", v);
        setSearchParams(next);
      },
    },
  ];

  const columns: Column<SupportTicket>[] = [
    {
      header: "Ticket ID",
      accessor: (t) => (
        <div>
          <span className="font-mono font-bold text-slate-900">#{t.id}</span>
          {t.bookingId && (
            <p className="text-[11px] text-slate-500 font-mono">
              Booking #{t.bookingId}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Customer",
      accessor: (t) => (
        <span className="font-bold text-slate-900">{t.customerName}</span>
      ),
    },
    {
      header: "Issue Subject",
      accessor: (t) => (
        <div>
          <p className="font-semibold text-slate-900">{t.subject}</p>
          <p className="text-[11px] text-slate-500 truncate max-w-xs">
            {t.description}
          </p>
        </div>
      ),
    },
    {
      header: "Priority",
      accessor: (t) => <PriorityBadge priority={t.priority} />,
    },
    {
      header: "Resolution SLA",
      accessor: (t) => (
        <SLAIndicator
          elapsedHours={t.ageInHours}
          limitHours={t.slaHours}
          isBreached={t.slaBreached}
        />
      ),
    },
    {
      header: "Status",
      accessor: (t) => <StatusBadge status={t.status} />,
    },
    {
      header: "Action",
      accessor: (t) =>
        t.status !== "RESOLVED" && t.status !== "CLOSED" ? (
          <button
            type="button"
            onClick={() => {
              setSelectedTicket(t);
              setIsResolveOpen(true);
            }}
            className="px-3 py-1 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all"
          >
            Resolve Ticket
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-blue-600" />
            <span>Customer Support Tickets & SLA Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Emergency customer complaints, SLA countdowns, and resolution
            arbitration
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
        data={tickets}
        keyExtractor={(t) => t.id}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        title={`Resolve Support Ticket #${selectedTicket?.id}`}
        subtitle={`Customer: ${selectedTicket?.customerName} • Subject: ${selectedTicket?.subject}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Resolution Summary / Actions Taken
            </label>
            <textarea
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              rows={3}
              placeholder="Detail the actions taken to address the customer ticket..."
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
              Confirm Resolution
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
