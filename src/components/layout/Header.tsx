import React, { useState } from "react";
import { Bell, User, LogOut, ChevronDown, Sparkles, Check } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";
import { NOTIFICATIONS } from "../../mocks/mockData";
import { Link, useNavigate } from "react-router-dom";
import type { AdminRole } from "../../types/admin";

export const Header: React.FC = () => {
  const { admin, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const unreadNotifications = NOTIFICATIONS.filter((n) => !n.read);

  const roles: { role: AdminRole; label: string; desc: string }[] = [
    {
      role: "SUPER_ADMIN",
      label: "Super Admin",
      desc: "Full unrestricted platform access",
    },
    {
      role: "OPERATIONS_ADMIN",
      label: "Operations Admin",
      desc: "Bookings, partners, verification, assignments",
    },
    {
      role: "FINANCE_ADMIN",
      label: "Finance Admin",
      desc: "Payments, settlements, refunds, revenue",
    },
    {
      role: "SUPPORT_ADMIN",
      label: "Support Admin",
      desc: "Customer support tickets, disputes",
    },
  ];

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white px-8 flex items-center justify-end sticky top-0 z-30 shadow-2xs">
      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowRoleSwitcher(!showRoleSwitcher);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{admin?.role.replace("_", " ")}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">
                  Simulate Admin Role
                </p>
                <p className="text-[11px] text-slate-500">
                  Test permission-gated navigation and controls
                </p>
              </div>
              <div className="py-1 space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      switchRole(r.role);
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-start justify-between transition-colors ${
                      admin?.role === r.role
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{r.label}</p>
                      <p className="text-[10px] text-slate-500 font-normal">
                        {r.desc}
                      </p>
                    </div>
                    {admin?.role === r.role && (
                      <Check className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell with badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleSwitcher(false);
              setShowProfileMenu(false);
            }}
            className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Operational Alerts
                </span>
                <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  {unreadNotifications.length} Critical
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                {NOTIFICATIONS.map((n) => (
                  <Link
                    key={n.id}
                    to={n.link || "#"}
                    onClick={() => setShowNotifications(false)}
                    className="block p-2.5 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <p className="text-xs font-semibold text-slate-900">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {n.createdAt}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu (Avatar AM / Aarav) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowRoleSwitcher(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0f172a] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              AM
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                Aarav Mehta
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Senior Operator
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Aarav Mehta</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {admin?.email}
                </p>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
