import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { partnerService } from "../../services/partnerService";
import type { Partner } from "../../types/partner";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { useAuth } from "../auth/AuthContext";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Shield,
  FileText,
  UserCheck,
  UserX,
  CheckCircle,
} from "lucide-react";

export const PartnerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<"ACTIVE" | "SUSPENDED">(
    "ACTIVE",
  );
  const [actionSuccess, setActionSuccess] = useState("");

  const loadPartner = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await partnerService.getPartnerById(id);
      setPartner(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (reason: string) => {
    if (!partner) return;
    await partnerService.updatePartnerStatus(
      partner.id,
      targetStatus,
      reason,
      admin?.name || "Admin",
    );
    setActionSuccess(`Partner status updated to ${targetStatus}`);
    loadPartner();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading partner profile #{id}...
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">Partner not found</h2>
        <button
          type="button"
          onClick={() => navigate("/partners")}
          className="mt-4 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-xs font-semibold"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
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
              <h1 className="text-xl font-bold text-slate-900">
                {partner.name}
              </h1>
              <StatusBadge status={partner.status} />
              <StatusBadge status={partner.verificationStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Category:{" "}
              <span className="font-semibold text-slate-800">
                {partner.serviceCategories.join(", ") || partner.services[0]}
              </span>{" "}
              • ID: {partner.id}
            </p>
          </div>
        </div>

        {/* Status mutation buttons */}
        <div className="flex items-center gap-2">
          {partner.status === "ACTIVE" ? (
            <button
              type="button"
              onClick={() => {
                setTargetStatus("SUSPENDED");
                setIsStatusDialogOpen(true);
              }}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
            >
              <UserX className="w-4 h-4" />
              <span>Suspend Partner</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTargetStatus("ACTIVE");
                setIsStatusDialogOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Activate Partner</span>
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Documents */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Mobile Phone</p>
                  <p className="text-sm font-bold text-slate-900 font-mono">
                    {partner.mobile}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Operating Zone</p>
                  <p className="text-sm font-bold text-slate-900">
                    {partner.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Joined Platform</p>
                  <p className="text-sm font-bold text-slate-900">
                    {partner.joinedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">KYC Status</p>
                  <p className="text-sm font-bold text-slate-900">
                    {partner.verificationStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Submitted KYC & Verification Documents
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partner.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{doc.type}</p>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} className="text-[10px]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Performance & Earnings */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Performance Metrics
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Customer Rating</span>
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{partner.rating || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Completed Jobs</span>
                <span className="text-xs font-bold text-slate-900">
                  {partner.completedJobs}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Financial Escrow</span>
              <DollarSign className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">
                  Total Lifetime Earnings
                </span>
                <span className="text-lg font-bold text-slate-900 font-heading">
                  ₹{partner.totalEarnings.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Pending Escrow Payout
                </span>
                <span className="text-sm font-bold text-emerald-600 font-heading">
                  ₹{partner.pendingPayout.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleStatusChange}
        title={`${targetStatus === "SUSPENDED" ? "Suspend" : "Activate"} Partner ${partner.name}`}
        message={`Are you sure you want to change this partner account status to ${targetStatus}? This will impact their job dispatch queue.`}
        requireReason={true}
        reasonPlaceholder={`Specify mandatory rationale for changing partner status to ${targetStatus}...`}
        confirmLabel={`Set to ${targetStatus}`}
        isDestructive={targetStatus === "SUSPENDED"}
      />
    </div>
  );
};
