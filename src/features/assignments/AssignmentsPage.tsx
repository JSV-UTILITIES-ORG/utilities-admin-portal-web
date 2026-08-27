import React, { useEffect, useState } from "react";
import { bookingService } from "../../services/bookingService";
import { partnerService } from "../../services/partnerService";
import type { Booking } from "../../types/booking";
import type { Partner } from "../../types/partner";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SLAIndicator } from "../../components/ui/SLAIndicator";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../auth/AuthContext";
import { Send, UserCheck, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AssignmentsPage: React.FC = () => {
  const [unassignedList, setUnassignedList] = useState<Booking[]>([]);
  const [failedList, setFailedList] = useState<Booking[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [u, f, p] = await Promise.all([
        bookingService.getBookings({ assignmentStatus: "UNASSIGNED" }),
        bookingService.getBookings({ assignmentStatus: "FAILED" }),
        partnerService.getPartners({ status: "ACTIVE" }),
      ]);
      setUnassignedList(u);
      setFailedList(f);
      setPartners(p);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAssignModal = (b: Booking) => {
    setSelectedBooking(b);
    setSelectedPartnerId("");
    setIsAssignModalOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedBooking || !selectedPartnerId) return;
    const partner = partners.find((p) => p.id === selectedPartnerId);
    if (!partner) return;

    await bookingService.assignPartner(
      selectedBooking.id,
      partner.id,
      partner.name,
      admin?.name || "Admin",
    );
    setIsAssignModalOpen(false);
    setActionSuccess(`Assigned #${selectedBooking.id} to ${partner.name}`);
    loadData();
  };

  const failedColumns: Column<Booking>[] = [
    {
      header: "Booking ID",
      accessor: (b) => (
        <div className="font-mono font-bold text-red-600">#{b.id}</div>
      ),
    },
    {
      header: "Customer",
      accessor: (b) => (
        <div>
          <p className="font-bold text-slate-900">{b.customerName}</p>
          <p className="text-[11px] text-slate-400 font-mono">
            {b.customerMobile}
          </p>
        </div>
      ),
    },
    {
      header: "Service & Zone",
      accessor: (b) => (
        <div>
          <p className="font-semibold text-slate-900">{b.serviceName}</p>
          <p className="text-[11px] text-slate-400">{b.city}</p>
        </div>
      ),
    },
    {
      header: "SLA Elapsed",
      accessor: (b) => (
        <SLAIndicator
          elapsedMinutes={b.waitingMinutes || 60}
          limitMinutes={45}
          isBreached={true}
        />
      ),
    },
    {
      header: "Status",
      accessor: (b) => <StatusBadge status={b.assignmentStatus} />,
    },
    {
      header: "Actions",
      accessor: (b) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openAssignModal(b)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Dispatch</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/bookings/${b.id}`)}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const unassignedColumns: Column<Booking>[] = [
    {
      header: "Booking ID",
      accessor: (b) => (
        <div className="font-mono font-bold text-slate-900">#{b.id}</div>
      ),
    },
    {
      header: "Customer",
      accessor: (b) => (
        <div>
          <p className="font-bold text-slate-900">{b.customerName}</p>
          <p className="text-[11px] text-slate-400">{b.city}</p>
        </div>
      ),
    },
    {
      header: "Service",
      accessor: (b) => (
        <div>
          <p className="font-semibold text-slate-900">{b.serviceName}</p>
          <p className="text-[11px] text-slate-400">
            Scheduled: {b.scheduledAt}
          </p>
        </div>
      ),
    },
    {
      header: "Waiting Time",
      accessor: (b) => (
        <SLAIndicator
          elapsedMinutes={b.waitingMinutes || 15}
          limitMinutes={45}
        />
      ),
    },
    {
      header: "Action",
      accessor: (b) => (
        <button
          type="button"
          onClick={() => openAssignModal(b)}
          className="px-3 py-1 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs"
        >
          Assign Partner
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          <span>Dispatch & Assignment Queue</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Surfaces failed SLA assignments and unassigned bookings requiring
          manual operator matching
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 1. CRITICAL: FAILED ASSIGNMENTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block"></span>
            <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider">
              Critical: Failed Assignments SLA Breaches ({failedList.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Matching timeout &gt; 45 mins
          </span>
        </div>

        <DataTable
          columns={failedColumns}
          data={failedList}
          keyExtractor={(b) => b.id}
          isLoading={isLoading}
          emptyMessage="Zero failed assignments"
          emptyDescription="All booking dispatch SLAs are operating normally"
        />
      </div>

      {/* 2. UNASSIGNED QUEUE */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Awaiting Partner Acceptance ({unassignedList.length})
        </h2>

        <DataTable
          columns={unassignedColumns}
          data={unassignedList}
          keyExtractor={(b) => b.id}
          isLoading={isLoading}
          emptyMessage="No pending unassigned bookings"
          emptyDescription="All current bookings have assigned technicians"
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Partner to Booking #${selectedBooking?.id}`}
        subtitle={`Match with available active technician in ${selectedBooking?.city}`}
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {partners.map((p) => (
              <label
                key={p.id}
                className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                  selectedPartnerId === p.id
                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="partner_assignment"
                    checked={selectedPartnerId === p.id}
                    onChange={() => setSelectedPartnerId(p.id)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-500">
                      ★ {p.rating || "New"} • {p.completedJobs} jobs completed •{" "}
                      {p.city}
                    </p>
                  </div>
                </div>
                <StatusBadge status={p.status} className="text-[10px]" />
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              disabled={!selectedPartnerId}
              className="px-4 py-2 text-xs font-bold bg-[#0f172a] hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg"
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
