import React, { useEffect, useState } from "react";
import { auditService } from "../../services/auditService";
import type { AuditLog } from "../../types/audit";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { FilterBar, type FilterGroup } from "../../components/ui/FilterBar";
import { FileText, ShieldAlert } from "lucide-react";

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await auditService.getAuditLogs(
        entityFilter === "ALL" ? undefined : entityFilter,
      );
      setLogs(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityFilter]);

  const filterGroups: FilterGroup[] = [
    {
      id: "entity",
      label: "Target Entity",
      value: entityFilter,
      options: [
        { label: "All Entities", value: "ALL" },
        { label: "Booking", value: "Booking" },
        { label: "Partner", value: "Partner" },
        { label: "Verification", value: "Verification" },
        { label: "Refund", value: "Refund" },
        { label: "Dispute", value: "Dispute" },
        { label: "Settlement", value: "Settlement" },
      ],
      onChange: setEntityFilter,
    },
  ];

  const columns: Column<AuditLog>[] = [
    {
      header: "Timestamp",
      accessor: (l) => (
        <span className="text-xs font-mono text-slate-500">{l.timestamp}</span>
      ),
    },
    {
      header: "Operator / Admin",
      accessor: (l) => (
        <span className="font-bold text-slate-900">{l.adminName}</span>
      ),
    },
    {
      header: "Action Dispatched",
      accessor: (l) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-800">
          {l.action}
        </span>
      ),
    },
    {
      header: "Target Entity",
      accessor: (l) => (
        <div className="text-xs text-slate-700 font-medium">
          {l.entity}{" "}
          <span className="font-mono text-slate-400 font-bold">
            #{l.entityId}
          </span>
        </div>
      ),
    },
    {
      header: "State Mutation",
      accessor: (l) => (
        <div className="text-xs">
          {l.previousValue && l.newValue ? (
            <span>
              <span className="text-slate-400 line-through mr-1">
                {l.previousValue}
              </span>
              <span className="font-bold text-slate-800">→ {l.newValue}</span>
            </span>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </div>
      ),
    },
    {
      header: "Audit Rationale / Justification",
      accessor: (l) => (
        <div className="text-xs text-slate-600 max-w-xs truncate">
          {l.reason || "Standard operational dispatch"}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Immutable Governance Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic timestamped record of administrative overrides, manual
            approvals, and system state changes
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Audit Log Read-Only Enforced</span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs">
        <FilterBar
          groups={filterGroups}
          onReset={() => setEntityFilter("ALL")}
        />
      </div>

      <DataTable
        columns={columns}
        data={logs}
        keyExtractor={(l) => l.id}
        isLoading={isLoading}
      />
    </div>
  );
};
