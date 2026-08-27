import React, { useState } from "react";
import { ROLE_PERMISSIONS } from "../../permissions/roles";
import type { AdminRole, Permission } from "../../types/admin";
import { KeyRound, Shield, Check } from "lucide-react";

export const RolesPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<AdminRole>("SUPER_ADMIN");

  const allRoles: { role: AdminRole; label: string; desc: string }[] = [
    {
      role: "SUPER_ADMIN",
      label: "Super Admin",
      desc: "Unrestricted full access across all modules and governance settings",
    },
    {
      role: "OPERATIONS_ADMIN",
      label: "Operations Admin",
      desc: "Bookings, assignments, dispatch overrides and partner KYC reviews",
    },
    {
      role: "FINANCE_ADMIN",
      label: "Finance Admin",
      desc: "Payments, customer refunds, commission rates and partner settlements",
    },
    {
      role: "SUPPORT_ADMIN",
      label: "Support Admin",
      desc: "Customer support tickets, emergency SLA alerts and dispute arbitration",
    },
  ];

  const permissionCategories: { name: string; permissions: Permission[] }[] = [
    {
      name: "Dashboard & Analytics",
      permissions: ["dashboard.view", "reports.view"],
    },
    {
      name: "Bookings & Dispatch",
      permissions: [
        "bookings.view",
        "bookings.manage",
        "assignments.view",
        "assignments.manage",
      ],
    },
    {
      name: "Partners & KYC",
      permissions: [
        "partners.view",
        "partners.manage",
        "verification.view",
        "verification.manage",
      ],
    },
    {
      name: "Customers & Services",
      permissions: [
        "users.view",
        "users.manage",
        "services.view",
        "services.manage",
      ],
    },
    {
      name: "Finance & Payments",
      permissions: [
        "payments.view",
        "payments.manage",
        "refunds.view",
        "refunds.manage",
        "finance.view",
        "finance.manage",
      ],
    },
    {
      name: "Support & Disputes",
      permissions: [
        "support.view",
        "support.manage",
        "disputes.view",
        "disputes.manage",
      ],
    },
    {
      name: "Administration",
      permissions: [
        "roles.view",
        "roles.manage",
        "audit.view",
        "settings.manage",
      ],
    },
  ];

  const activePerms = ROLE_PERMISSIONS[selectedRole] || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-blue-600" />
          <span>Role-Based Access Control (RBAC) Matrix</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect capability permissions, security gates and authorization tiers
          across system roles
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {allRoles.map((r) => (
          <button
            key={r.role}
            type="button"
            onClick={() => setSelectedRole(r.role)}
            className={`p-4 border rounded-2xl text-left transition-all ${
              selectedRole === r.role
                ? "bg-white border-slate-900 ring-2 ring-slate-900 shadow-xs"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Shield
                className={`w-4 h-4 ${selectedRole === r.role ? "text-blue-600" : "text-slate-400"}`}
              />
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {ROLE_PERMISSIONS[r.role].length} perms
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900">{r.label}</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              {r.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Permissions Grid */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Capability Matrix for {selectedRole.replace("_", " ")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Green checks indicate authorized endpoints and UI actions
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs font-mono">
            {activePerms.length} Active Permissions
          </span>
        </div>

        <div className="space-y-5">
          {permissionCategories.map((cat) => (
            <div key={cat.name} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {cat.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {cat.permissions.map((perm) => {
                  const isGranted = activePerms.includes(perm);
                  return (
                    <div
                      key={perm}
                      className={`p-3 border rounded-xl flex items-center justify-between text-xs transition-all ${
                        isGranted
                          ? "bg-slate-50/70 border-slate-200 text-slate-900"
                          : "bg-slate-50/30 border-slate-100 text-slate-400 opacity-60"
                      }`}
                    >
                      <span className="font-mono text-[11px] font-medium">
                        {perm}
                      </span>
                      {isGranted ? (
                        <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">
                          RESTRICTED
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
