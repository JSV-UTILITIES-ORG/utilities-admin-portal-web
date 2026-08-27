import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import type { Customer } from "../../types/customer";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { useAuth } from "../auth/AuthContext";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  UserX,
  UserCheck,
  CheckCircle,
} from "lucide-react";

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<"ACTIVE" | "SUSPENDED">(
    "ACTIVE",
  );
  const [actionSuccess, setActionSuccess] = useState("");

  const loadUser = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await userService.getUserById(id);
      setUser(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (reason: string) => {
    if (!user) return;
    await userService.updateUserStatus(
      user.id,
      targetStatus,
      reason,
      admin?.name || "Admin",
    );
    setActionSuccess(`Customer account status updated to ${targetStatus}`);
    loadUser();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading customer profile #{id}...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">
          Customer record not found
        </h2>
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="mt-4 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-xs font-semibold"
        >
          Back to Customer Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer ID:{" "}
              <span className="font-mono font-bold text-slate-800">
                {user.id}
              </span>
            </p>
          </div>
        </div>

        <div>
          {user.status === "ACTIVE" ? (
            <button
              type="button"
              onClick={() => {
                setTargetStatus("SUSPENDED");
                setIsStatusDialogOpen(true);
              }}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
            >
              <UserX className="w-4 h-4" />
              <span>Suspend Account</span>
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
              <span>Reactivate Account</span>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Email Address</p>
                  <p className="text-sm font-bold text-slate-900">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Mobile Number</p>
                  <p className="text-sm font-bold text-slate-900 font-mono">
                    {user.mobile}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Primary City</p>
                  <p className="text-sm font-bold text-slate-900">
                    {user.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Member Since</p>
                  <p className="text-sm font-bold text-slate-900">
                    {user.createdAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Lifetime Metrics</span>
              <DollarSign className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Total Spend</span>
                <span className="text-xl font-bold text-slate-900 font-heading">
                  ₹{user.totalSpend.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Total Bookings</span>
                <span className="text-sm font-bold text-slate-800 font-heading">
                  {user.totalBookings} orders
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
        title={`${targetStatus === "SUSPENDED" ? "Suspend" : "Reactivate"} Customer Account`}
        message={`Are you sure you want to change account status for ${user.name} to ${targetStatus}?`}
        requireReason={true}
        reasonPlaceholder="Specify reason for account status change (e.g. Fraud prevention, abuse report)..."
        confirmLabel={`Set to ${targetStatus}`}
        isDestructive={targetStatus === "SUSPENDED"}
      />
    </div>
  );
};
