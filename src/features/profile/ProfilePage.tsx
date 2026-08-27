import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { mockStore } from "../../services/mockStore";
import {
  User,
  Shield,
  KeyRound,
  Mail,
  CheckCircle2,
  Smartphone,
  History,
  Save,
  Check,
  Building2,
  Bell,
  Fingerprint,
  Laptop,
} from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "clearance" | "security" | "sessions" | "preferences"
  >("profile");

  // Personal info state
  const [fullName, setFullName] = useState(admin?.name || "Aarav Mehta");
  const [email, setEmail] = useState(
    admin?.email || "aarav.admin@cityservices.io",
  );
  const [phone, setPhone] = useState("+91 98765 00112");
  const department = "Central Operations & Marketplace Reliability";
  const [cityBase, setCityBase] = useState("Bengaluru HQ (Central Zone)");
  const [saveSuccess, setSaveSuccess] = useState("");

  // Password & Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [securityMsg, setSecurityMsg] = useState("");

  // Notification Preferences
  const [notifPreferences, setNotifPreferences] = useState({
    slaBreaches: true,
    failedPayments: true,
    partnerKYC: true,
    openDisputes: true,
    dailyDigest: false,
  });

  if (!admin) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess("Profile settings successfully saved.");
    setTimeout(() => setSaveSuccess(""), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSecurityMsg("New passwords do not match. Please verify.");
      return;
    }
    setSecurityMsg("Security credentials updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSecurityMsg(""), 3000);
  };

  const adminLogs = mockStore.auditLogs.filter(
    (l) =>
      l.adminName.toLowerCase() === admin.name.toLowerCase() ||
      admin.role === "SUPER_ADMIN",
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <User className="w-6 h-6 text-blue-600" />
            <span>Admin Operator Profile</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personal credentials, authorized security clearance, active
            sessions, and compliance audit trail
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span className="text-slate-700 font-semibold">Active Session</span>
          <span className="text-slate-400">• IP: 192.168.1.12</span>
        </div>
      </div>

      {/* Hero Operator Identity Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center text-3xl font-extrabold shadow-md shadow-slate-900/10">
                AM
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center"
                title="Online"
              >
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900 font-heading">
                  {fullName}
                </h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#0f172a] text-white uppercase tracking-wider">
                  {admin.role.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
                <span>{email}</span>
                <span>•</span>
                <span>{department}</span>
              </p>
              <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-400 font-mono">
                <span>
                  Operator ID:{" "}
                  <strong className="text-slate-700">{admin.id}</strong>
                </span>
                <span>•</span>
                <span>
                  Zone: <strong className="text-slate-700">{cityBase}</strong>
                </span>
                <span>•</span>
                <span>
                  Last login:{" "}
                  <strong className="text-slate-700">{admin.lastLogin}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Security Clearance Tier
            </span>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>TIER-1 UNRESTRICTED</span>
            </div>
            <span className="text-[11px] text-slate-400">
              2FA Verified • TOTP
            </span>
          </div>
        </div>
      </div>

      {/* Clean Light Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white p-1 rounded-xl border shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "profile"
              ? "bg-[#0f172a] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Personal Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("clearance")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "clearance"
              ? "bg-[#0f172a] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Active Clearances ({admin.permissions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "security"
              ? "bg-[#0f172a] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Security & 2FA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "sessions"
              ? "bg-[#0f172a] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Session & Audit Logs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preferences")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "preferences"
              ? "bg-[#0f172a] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Alert Preferences</span>
        </button>
      </div>

      {/* TAB 1: Personal Details */}
      {activeTab === "profile" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Operator Details
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official contact details listed in the marketplace governance
                registry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Assigned Operating Headquarters
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={cityBase}
                    onChange={(e) => setCityBase(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                All changes are logged in the immutable system audit trail.
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Active Clearances & RBAC */}
      {activeTab === "clearance" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Authorized Operational Permissions ({admin.permissions.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Granted security capabilities under active role{" "}
                <span className="font-bold text-slate-900">{admin.role}</span>
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-mono font-bold">
              ROLE: {admin.role}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {admin.permissions.map((perm) => (
              <div
                key={perm}
                className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center gap-2.5 text-xs text-slate-800"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[11px] font-semibold">
                  {perm}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Security, 2FA & Password */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Two-Factor Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Hardware & Authenticator 2-Factor Authentication (2FA)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Requires Time-based One-Time Password (TOTP) from Google
                  Authenticator on login
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {twoFactorEnabled ? "● 2FA ENFORCED & ACTIVE" : "○ DISABLED"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
            >
              {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </button>
          </div>

          {/* Change Password Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Change Password
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Passwords must contain minimum 10 characters with numbers and
                special symbols
              </p>
            </div>

            {securityMsg && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700">
                {securityMsg}
              </div>
            )}

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4 max-w-md"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: Sessions & Activity Logs */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          {/* Active Device Sessions */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Browser Sessions
            </h3>

            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50 text-xs">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-slate-900">
                    Chrome on macOS (Current Device)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    IP: 192.168.1.12 • Bengaluru, India • Active now
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px] border border-emerald-200">
                CURRENT
              </span>
            </div>
          </div>

          {/* Audit History */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Operator Audit Trail
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Timestamped log of sensitive operations dispatched by {fullName}
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {adminLogs.map((log) => (
                <div
                  key={log.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono text-slate-400 mr-2">
                      {log.timestamp}
                    </span>
                    <span className="font-bold text-slate-900">
                      {log.action}
                    </span>{" "}
                    <span className="text-slate-500">
                      on {log.entity} #{log.entityId}
                    </span>
                  </div>
                  {log.reason && (
                    <span className="text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {log.reason}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Alert Preferences */}
      {activeTab === "preferences" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Emergency & Operations Alert Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose which high-priority incidents trigger instant desktop push
              and dashboard banner notices
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                key: "slaBreaches",
                label: "Support SLA Breaches (Emergency 30-min alerts)",
                desc: "Instant notice when critical customer emergency tickets breach SLA",
              },
              {
                key: "failedPayments",
                label: "Payment Failures (> ₹5,000 threshold)",
                desc: "Notifications on high-value checkout timeouts requiring gateway retry",
              },
              {
                key: "partnerKYC",
                label: "Partner Verification Submissions (> 24h age)",
                desc: "Alerts when partner onboarding queues exceed review SLA",
              },
              {
                key: "openDisputes",
                label: "Escalated Customer Fraud & Damage Disputes",
                desc: "Critical alerts when operator arbitration is requested",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start gap-3.5 p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={
                    notifPreferences[item.key as keyof typeof notifPreferences]
                  }
                  onChange={(e) =>
                    setNotifPreferences((prev) => ({
                      ...prev,
                      [item.key]: e.target.checked,
                    }))
                  }
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {item.label}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
