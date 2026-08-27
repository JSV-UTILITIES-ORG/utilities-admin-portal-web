import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { bookingService } from "../../services/bookingService";
import { partnerService } from "../../services/partnerService";
import type { Booking } from "../../types/booking";
import type { Partner } from "../../types/partner";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Timeline } from "../../components/ui/Timeline";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../auth/AuthContext";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  CreditCard,
  UserCheck,
  AlertCircle,
  XCircle,
  Wrench,
  CheckCircle,
} from "lucide-react";

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await bookingService.getBookingById(id);
      setBooking(data);
      const activePartners = await partnerService.getPartners({
        status: "ACTIVE",
      });
      setPartners(activePartners);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAssign = async () => {
    if (!booking || !selectedPartnerId) return;
    const partner = partners.find((p) => p.id === selectedPartnerId);
    if (!partner) return;

    await bookingService.assignPartner(
      booking.id,
      partner.id,
      partner.name,
      admin?.name || "Admin",
    );
    setIsAssignModalOpen(false);
    setActionSuccess(`Assigned successfully to ${partner.name}`);
    loadData();
  };

  const handleCancelBooking = async (reason: string) => {
    if (!booking) return;
    await bookingService.cancelBooking(
      booking.id,
      reason,
      admin?.name || "Admin",
    );
    setActionSuccess("Booking cancelled and logged in audit trail");
    loadData();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading booking record #{id}...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">Booking not found</h2>
        <button
          type="button"
          onClick={() => navigate("/bookings")}
          className="mt-4 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-xs font-semibold"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button and Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-mono text-slate-900">
                #{booking.id}
              </h1>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Service:{" "}
              <span className="font-semibold text-slate-800">
                {booking.serviceName}
              </span>{" "}
              • {booking.categoryName}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
            <>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {booking.partnerId ? "Reassign Partner" : "Assign Partner"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Booking</span>
              </button>
            </>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Timeline */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer & Location Details */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer & Service Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Customer Name</p>
                  <Link
                    to={`/users/${booking.customerId}`}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {booking.customerName}
                  </Link>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {booking.customerMobile}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Scheduled Time</p>
                  <p className="text-sm font-bold text-slate-900">
                    {booking.scheduledAt}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Created: {booking.createdAt}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-3 pt-3 border-t border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Service Location</p>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">
                    {booking.address}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Zone: {booking.city}
                  </p>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-bold">Operator Dispatch Note:</span>{" "}
                  {booking.notes}
                </div>
              </div>
            )}
          </div>

          {/* Service Timeline */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Execution Lifecycle & Audit Timeline
            </h3>
            <Timeline events={booking.timeline} />
          </div>
        </div>

        {/* Right 1 Col: Partner Card & Payment Info */}
        <div className="space-y-6">
          {/* Assigned Partner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Service Partner</span>
              <Wrench className="w-4 h-4 text-slate-400" />
            </h3>

            {booking.partnerId ? (
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-900">
                  {booking.partnerName}
                </p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={booking.assignmentStatus} />
                </div>
                <Link
                  to={`/partners/${booking.partnerId}`}
                  className="text-xs text-blue-600 font-semibold hover:underline block pt-2"
                >
                  View Partner Profile →
                </Link>
              </div>
            ) : (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>No Partner Assigned</span>
                </div>
                <p className="text-slate-600">
                  Waiting duration: {booking.waitingMinutes || 45} mins.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="w-full py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                >
                  Match & Assign Now
                </button>
              </div>
            )}
          </div>

          {/* Payment Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Financials</span>
              <CreditCard className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Service Fee</span>
                <span className="text-lg font-bold text-slate-900 font-heading">
                  ₹{booking.amount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Payment Status</span>
                <StatusBadge status={booking.paymentStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Assignment Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Partner to Booking #${booking.id}`}
        subtitle={`Select a verified technician in ${booking.city}`}
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
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
                    name="partner"
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
              Confirm Dispatch
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Booking Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelBooking}
        title={`Cancel Booking #${booking.id}`}
        message="Are you sure you want to cancel this booking? This will notify both the customer and partner."
        requireReason={true}
        reasonPlaceholder="Specify reason for cancellation (e.g. Customer duplicate, partner unavailable)..."
        confirmLabel="Cancel Booking"
        isDestructive={true}
      />
    </div>
  );
};
