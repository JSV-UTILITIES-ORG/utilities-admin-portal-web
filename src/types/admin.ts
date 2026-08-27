export type Permission =
  | "dashboard.view"
  | "users.view"
  | "users.manage"
  | "partners.view"
  | "partners.manage"
  | "partners.verify"
  | "services.view"
  | "services.manage"
  | "bookings.view"
  | "bookings.manage"
  | "assignments.view"
  | "assignments.manage"
  | "verification.view"
  | "verification.manage"
  | "payments.view"
  | "payments.manage"
  | "refunds.view"
  | "refunds.manage"
  | "finance.view"
  | "finance.manage"
  | "support.view"
  | "support.manage"
  | "disputes.view"
  | "disputes.manage"
  | "reports.view"
  | "roles.view"
  | "roles.manage"
  | "audit.view"
  | "settings.manage";

export type AdminRole =
  "SUPER_ADMIN" | "OPERATIONS_ADMIN" | "FINANCE_ADMIN" | "SUPPORT_ADMIN";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: Permission[];
  status: "ACTIVE" | "INACTIVE";
  lastLogin: string;
  avatar?: string;
}
