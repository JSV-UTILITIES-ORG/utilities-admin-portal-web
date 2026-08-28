import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Send,
  Users,
  ShieldCheck,
  Wrench,
  UserCheck,
  CreditCard,
  RotateCcw,
  Landmark,
  Headphones,
  AlertOctagon,
  BarChart3,
  KeyRound,
  FileText,
  Settings,
  Sparkles,
  Briefcase,
  Home,
} from "lucide-react";
import { usePermissions } from "../../permissions/usePermissions";
import type { Permission } from "../../types/admin";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: Permission;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { hasPermission } = usePermissions();

  const sections: NavSection[] = [
    {
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: <LayoutDashboard className="w-4 h-4" />,
          permission: "dashboard.view",
        },
      ],
    },
    {
      title: "SERVICE MARKETPLACE",
      items: [
        {
          label: "Bookings",
          path: "/bookings",
          icon: <CalendarCheck className="w-4 h-4" />,
          permission: "bookings.view",
        },
        {
          label: "Assignment Center",
          path: "/assignments",
          icon: <Send className="w-4 h-4" />,
          permission: "assignments.view",
        },
        {
          label: "Service Catalogue",
          path: "/services",
          icon: <Wrench className="w-4 h-4" />,
          permission: "services.view",
        },
      ],
    },
    {
      title: "WORK MARKETPLACE",
      items: [
        {
          label: "Partner Jobs",
          path: "/jobs",
          icon: <Briefcase className="w-4 h-4" />,
          permission: "jobs.view",
        },
      ],
    },
    {
      title: "ACCOMMODATION (PG)",
      items: [
        {
          label: "Stay / PG Listings",
          path: "/accommodations",
          icon: <Home className="w-4 h-4" />,
          permission: "accommodations.view",
        },
      ],
    },
    {
      title: "PARTNERS & KYC",
      items: [
        {
          label: "Partners Directory",
          path: "/partners",
          icon: <Users className="w-4 h-4" />,
          permission: "partners.view",
        },
        {
          label: "Real-Time KYC",
          path: "/verification",
          icon: <ShieldCheck className="w-4 h-4" />,
          permission: "verification.view",
        },
      ],
    },
    {
      title: "CUSTOMERS",
      items: [
        {
          label: "Users",
          path: "/users",
          icon: <UserCheck className="w-4 h-4" />,
          permission: "users.view",
        },
      ],
    },
    {
      title: "FINANCE & SETTLEMENTS",
      items: [
        {
          label: "Payments",
          path: "/payments",
          icon: <CreditCard className="w-4 h-4" />,
          permission: "payments.view",
        },
        {
          label: "Refunds",
          path: "/refunds",
          icon: <RotateCcw className="w-4 h-4" />,
          permission: "refunds.view",
        },
        {
          label: "Multi-Domain Finance",
          path: "/finance",
          icon: <Landmark className="w-4 h-4" />,
          permission: "finance.view",
        },
      ],
    },
    {
      title: "CUSTOMER OPERATIONS",
      items: [
        {
          label: "Support Tickets",
          path: "/support",
          icon: <Headphones className="w-4 h-4" />,
          permission: "support.view",
        },
        {
          label: "Disputes & Quality",
          path: "/disputes",
          icon: <AlertOctagon className="w-4 h-4" />,
          permission: "disputes.view",
        },
      ],
    },
    {
      title: "ANALYTICS",
      items: [
        {
          label: "Analytics Reports",
          path: "/reports",
          icon: <BarChart3 className="w-4 h-4" />,
          permission: "reports.view",
        },
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        {
          label: "Roles & Permissions",
          path: "/roles",
          icon: <KeyRound className="w-4 h-4" />,
          permission: "roles.view",
        },
        {
          label: "Audit Logs",
          path: "/audit-logs",
          icon: <FileText className="w-4 h-4" />,
          permission: "audit.view",
        },
        {
          label: "Platform Settings",
          path: "/settings",
          icon: <Settings className="w-4 h-4" />,
          permission: "settings.manage",
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col shrink-0 border-r border-slate-200 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center text-white shadow-xs">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
            PaniMitra
          </h1>
          <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
            3-Marketplace Admin Hub
          </p>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="p-3 space-y-4 flex-1">
        {sections.map((section, sIdx) => {
          const visibleItems = section.items.filter(
            (item) => !item.permission || hasPermission(item.permission)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-1">
              {section.title && (
                <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </div>
              )}
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[#0f172a] text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
