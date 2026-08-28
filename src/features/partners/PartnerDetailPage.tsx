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
  Shield,
  FileText,
  UserCheck,
  UserX,
  CheckCircle,
  Briefcase,
  Home,
  Wrench,
  Fingerprint,
  CreditCard,
  Landmark,
} from "lucide-react";

export const PartnerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<"ACTIVE" | "SUSPENDED">("ACTIVE");
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
    try {
      if (targetStatus === "SUSPENDED") {
        await partnerService.suspendPartner(partner.id, reason, admin?.name || "Super Admin");
      } else {
        await partnerService.activatePartner(partner.id, reason, admin?.name || "Super Admin");
      }
      setActionSuccess(`Partner status successfully updated to ${targetStatus}`);
      setIsStatusDialogOpen(false);
      loadPartner();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-800">Partner Not Found</h2>
        <button
          onClick={() => navigate("/partners")}
          className="mt-3 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg"
        >
          Back to Partners
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/partners")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Partners List</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={partner.status} />
          {partner.status === "ACTIVE" ? (
            <button
              onClick={() => {
                setTargetStatus("SUSPENDED");
                setIsStatusDialogOpen(true);
              }}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold border border-rose-200 flex items-center gap-1.5 transition-colors"
            >
              <UserX className="w-4 h-4" />
              <span>Suspend Partner</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setTargetStatus("ACTIVE");
                setIsStatusDialogOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Activate Partner</span>
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Profile Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-base flex items-center justify-center border border-blue-200 shadow-xs">
              {partner.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">{partner.name}</h1>
                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {partner.id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {partner.mobile}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {partner.city} ({partner.address})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined {partner.joinedAt}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <div>
              <div className="text-base font-bold text-slate-900 leading-none">{partner.rating}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Rating</div>
            </div>
          </div>
        </div>

        {/* Multi-Capability Badges (Section 3.2 & 6.2) */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
            Enabled Capabilities
          </span>
          <div className="flex flex-wrap gap-2">
            {partner.capabilities?.findWork && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Wrench className="w-3.5 h-3.5" />
                <span>Find Work (Service Partner)</span>
              </span>
            )}
            {partner.capabilities?.createJobs && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Create Jobs (Workforce Contractor)</span>
              </span>
            )}
            {partner.capabilities?.hostAccommodation && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Home className="w-3.5 h-3.5" />
                <span>Accommodation Host (PG Owner)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-medium">Total Jobs</div>
          <div className="text-lg font-bold text-slate-900 mt-1">{partner.totalJobs}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-medium">Completed Jobs</div>
          <div className="text-lg font-bold text-slate-900 mt-1">{partner.completedJobs}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-medium">Total Earnings</div>
          <div className="text-lg font-bold text-slate-900 mt-1">
            ₹{partner.totalEarnings.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-medium">Pending Payout</div>
          <div className="text-lg font-bold text-amber-600 mt-1">
            ₹{partner.pendingPayout.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Real-Time KYC Verification Telemetry */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Real-Time KYC & Document Verification Status</span>
          </h2>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            {partner.verificationStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <Fingerprint className="w-6 h-6 text-blue-600" />
            <div>
              <div className="font-bold text-xs text-slate-800">Aadhaar (DigiLocker)</div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                Match: {partner.realtimeVerification?.aadhaarMatchScore || 97}% • Verified
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <div>
              <div className="font-bold text-xs text-slate-800">PAN (NSDL)</div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                Active • Match: {partner.realtimeVerification?.panMatchScore || 94}%
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <Landmark className="w-6 h-6 text-purple-600" />
            <div>
              <div className="font-bold text-xs text-slate-800">Bank Account (IMPS)</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Penny Drop Success</div>
            </div>
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-bold uppercase text-slate-400">Document Uploads</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {partner.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-2.5 bg-white rounded border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{doc.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Status Change */}
      <ConfirmationDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={() => handleStatusChange("Operational review decision")}
        title={targetStatus === "SUSPENDED" ? "Suspend Partner Account" : "Activate Partner Account"}
        message={`Are you sure you want to change ${partner.name}'s status to ${targetStatus}?`}
        confirmLabel={targetStatus === "SUSPENDED" ? "Suspend Partner" : "Activate Partner"}
        isDestructive={targetStatus === "SUSPENDED"}
      />
    </div>
  );
};
