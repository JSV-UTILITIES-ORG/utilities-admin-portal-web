import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { bookingService } from "../../services/bookingService";
import { partnerService } from "../../services/partnerService";
import type { Booking, BookingStatus } from "../../types/booking";
import type { Partner } from "../../types/partner";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Timeline } from "../../components/ui/Timeline";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { Modal } from "../../components/ui/Modal";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { useAuth } from "../auth/AuthContext";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  UserCheck,
  AlertCircle,
  XCircle,
  Wrench,
  CheckCircle,
  Camera,
  ArrowRight,
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
  const [isApproveChargeOpen, setIsApproveChargeOpen] = useState(false);
  const [isRejectChargeOpen, setIsRejectChargeOpen] = useState(false);

  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const loadBooking = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [bookingData, partnerList] = await Promise.all([
        bookingService.getBookingById(id),
        partnerService.getPartners({ status: "ACTIVE" }),
      ]);
      setBooking(bookingData);
      setPartners(partnerList);
      if (partnerList.length > 0 && !selectedPartnerId) {
        setSelectedPartnerId(partnerList[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAssign = async () => {
    if (!booking || !selectedPartnerId) return;
    try {
      await bookingService.assignPartner(booking.id, selectedPartnerId, admin?.id);
      setActionSuccess("Partner assigned successfully.");
      setIsAssignModalOpen(false);
      loadBooking();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to assign partner");
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !cancelReason.trim()) return;
    try {
      await bookingService.updateBookingStatus(
        booking.id,
        "CANCELLED",
        `Admin cancelled: ${cancelReason}`,
        admin?.id
      );
      setActionSuccess("Booking has been cancelled.");
      setIsCancelModalOpen(false);
      loadBooking();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to cancel booking");
    }
  };

  const handleApproveAddonCharge = async () => {
    if (!booking) return;
    try {
      await bookingService.approveAdditionalCharge(booking.id, admin?.id);
      setActionSuccess("Additional charge approved and added to booking total.");
      setIsApproveChargeOpen(false);
      loadBooking();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to approve additional charge");
    }
  };

  const handleRejectAddonCharge = async () => {
    if (!booking) return;
    try {
      await bookingService.rejectAdditionalCharge(booking.id, admin?.id);
      setActionSuccess("Additional charge rejected. Original price maintained.");
      setIsRejectChargeOpen(false);
      loadBooking();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to reject additional charge");
    }
  };

  const handleQuickStatusChange = async (status: BookingStatus) => {
    if (!booking) return;
    try {
      await bookingService.updateBookingStatus(
        booking.id,
        status,
        `Status shifted to ${status}`,
        admin?.id
      );
      setActionSuccess(`Status transitioned to ${status}`);
      loadBooking();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to transition status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800">Booking Not Found</h2>
        <button
          onClick={() => navigate("/bookings")}
          className="mt-3 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  const isClosedState =
    booking.status === "COMPLETED" ||
    booking.status === "CANCELLED" ||
    booking.status === "CLOSED";

  const hasPendingCharge =
    booking.additionalCharge && booking.additionalCharge.status === "PENDING";

  const partnerOptions = partners.map((p) => ({
    label: `${p.name} (${p.city} • ${p.rating}★)`,
    value: p.id,
    description: `${p.completedJobs} completed jobs • ${p.services.slice(0, 2).join(", ")}`,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => navigate("/bookings")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={booking.status} />

          {/* Dynamic Operational Controls based on current lifecycle stage */}
          {!isClosedState && (
            <>
              {booking.status === "ASSIGNED" && (
                <button
                  onClick={() => handleQuickStatusChange("TRAVELLING")}
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200/80 transition-colors"
                >
                  Mark Travelling
                </button>
              )}

              {booking.status === "TRAVELLING" && (
                <button
                  onClick={() => handleQuickStatusChange("ARRIVED")}
                  className="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-200/80 transition-colors"
                >
                  Mark Arrived
                </button>
              )}

              {booking.status === "ARRIVED" && (
                <button
                  onClick={() => handleQuickStatusChange("IN_PROGRESS")}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  Start Service
                </button>
              )}

              {booking.status === "IN_PROGRESS" && (
                <button
                  onClick={() => handleQuickStatusChange("COMPLETED")}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  Complete Service
                </button>
              )}

              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>{booking.partnerId ? "Reassign Partner" : "Assign Partner"}</span>
              </button>

              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200/80 flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          )}

          {isClosedState && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              Lifecycle Concluded
            </span>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* In-Service Additional Charge Alert Banner */}
      {hasPendingCharge && (
        <div className="p-4 bg-amber-50/90 border border-amber-300/80 rounded-2xl space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <span>Additional Charge Requested</span>
                  <span className="text-[10px] font-semibold bg-amber-200/60 text-amber-800 px-1.5 py-0.5 rounded">
                    Action Required
                  </span>
                </h3>
                <p className="text-xs text-amber-800 mt-0.5 font-medium">
                  {booking.additionalCharge?.reason} — Requested Amount:{" "}
                  <span className="font-bold text-slate-900">₹{booking.additionalCharge?.amount}</span>
                </p>
                {booking.additionalCharge?.description && (
                  <p className="text-[11px] text-amber-700 mt-1 italic">
                    "{booking.additionalCharge.description}"
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsRejectChargeOpen(true)}
                className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                Reject Charge
              </button>
              <button
                onClick={() => setIsApproveChargeOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approve ₹{booking.additionalCharge?.amount}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Evidence Photos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  {booking.id}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1.5">{booking.serviceName}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-slate-700">{booking.categoryName}</span>
                  {booking.packageName && (
                    <>
                      <span>•</span>
                      <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {booking.packageName}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Total Booking GMV
                </div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  ₹{booking.amount.toLocaleString()}
                </div>
                <span
                  className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    booking.paymentStatus === "SUCCESS"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  Payment: {booking.paymentStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1 font-semibold text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Scheduled Date & Time</span>
                </div>
                <div className="font-bold text-slate-900 mt-0.5">{booking.scheduledAt}</div>
              </div>
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1 font-semibold text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Service Location</span>
                </div>
                <div className="font-bold text-slate-900 mt-0.5">{booking.city}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{booking.address}</div>
              </div>
            </div>
          </div>

          {/* Before & After Work Evidence Photos */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Service Fulfillment Evidence Photos</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Uploaded via Partner Mobile App
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before Photos */}
              <div className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>Pre-Service Inspection</span>
                  <span className="text-[10px] text-slate-400 font-medium">Required on Start</span>
                </div>
                {booking.beforePhotos && booking.beforePhotos.length > 0 ? (
                  <img
                    src={booking.beforePhotos[0].url}
                    alt="Before service"
                    className="w-full h-44 object-cover rounded-lg border border-slate-200 shadow-2xs"
                  />
                ) : (
                  <div className="h-44 bg-slate-100/70 rounded-lg flex flex-col items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 gap-1">
                    <Camera className="w-5 h-5 text-slate-300" />
                    <span>No pre-service photo uploaded</span>
                  </div>
                )}
                <p className="text-[11px] text-slate-500 italic">
                  {booking.beforePhotos?.[0]?.caption || "Initial condition photograph"}
                </p>
              </div>

              {/* After Photos */}
              <div className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>Post-Service Verification</span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Required on Complete
                  </span>
                </div>
                {booking.afterPhotos && booking.afterPhotos.length > 0 ? (
                  <img
                    src={booking.afterPhotos[0].url}
                    alt="After service"
                    className="w-full h-44 object-cover rounded-lg border border-slate-200 shadow-2xs"
                  />
                ) : (
                  <div className="h-44 bg-slate-100/70 rounded-lg flex flex-col items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 gap-1">
                    <Camera className="w-5 h-5 text-slate-300" />
                    <span>No completion photo uploaded</span>
                  </div>
                )}
                <p className="text-[11px] text-slate-500 italic">
                  {booking.afterPhotos?.[0]?.caption || "Completed service inspection"}
                </p>
              </div>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audit Timeline & Activity
            </h3>
            <Timeline events={booking.timeline} />
          </div>
        </div>

        {/* Right Col: Customer & Partner Profiles */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Customer Details</span>
            </h3>
            <div className="space-y-1">
              <div className="font-bold text-slate-900 text-sm">{booking.customerName}</div>
              <div className="text-xs text-slate-500 font-medium">{booking.customerMobile}</div>
              <div className="text-xs text-slate-500 leading-relaxed pt-1">{booking.address}</div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <Link
                to={`/users/${booking.customerId}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <span>View Full User History</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Assigned Partner Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>Assigned Partner</span>
            </h3>
            {booking.partnerId ? (
              <div className="space-y-3">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{booking.partnerName}</div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">
                    ID: {booking.partnerId}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to={`/partners/${booking.partnerId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors group"
                  >
                    <span>View Partner Profile & KYC</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-xs text-amber-800 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80 leading-relaxed">
                No partner assigned yet. Click "Assign Partner" to assign an active, verified technician.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Partner Modal with CustomSelect */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Active Partner"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Select an active, verified technician for <b>{booking.serviceName}</b> in <b>{booking.city}</b>:
          </p>
          <div>
            <CustomSelect
              label="Eligible Active Partners"
              options={partnerOptions}
              value={selectedPartnerId}
              onChange={(val) => setSelectedPartnerId(val)}
              searchable={true}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              className="px-4 py-1.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors"
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Service Booking"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to cancel this booking? Please provide a clear operational reason for the audit trail.
          </p>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Cancellation Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Customer requested cancellation due to scheduling conflict..."
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCancelBooking}
              disabled={!cancelReason.trim()}
              className="px-4 py-1.5 font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs disabled:opacity-50 transition-colors"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>

      {/* Approve Add-on Charge Dialog */}
      <ConfirmationDialog
        isOpen={isApproveChargeOpen}
        onClose={() => setIsApproveChargeOpen(false)}
        onConfirm={handleApproveAddonCharge}
        title="Approve In-Service Additional Charge"
        message={`Approve the additional charge of ₹${booking.additionalCharge?.amount} for "${booking.additionalCharge?.reason}"? This will update the total booking amount to ₹${
          booking.amount + (booking.additionalCharge?.amount || 0)
        }.`}
        confirmLabel="Approve & Update Price"
        isDestructive={false}
      />

      {/* Reject Add-on Charge Dialog */}
      <ConfirmationDialog
        isOpen={isRejectChargeOpen}
        onClose={() => setIsRejectChargeOpen(false)}
        onConfirm={handleRejectAddonCharge}
        title="Reject Additional Charge"
        message="Reject this additional charge request? The partner will be instructed to proceed with the base service only without extra cost."
        confirmLabel="Reject Additional Charge"
        isDestructive={true}
      />
    </div>
  );
};
