import {
  INITIAL_ADMINS,
  SERVICE_CATEGORIES,
  SERVICES,
  CUSTOMERS,
  PARTNERS,
  VERIFICATIONS,
  BOOKINGS,
  ASSIGNMENTS,
  PAYMENTS,
  REFUNDS,
  DISPUTES,
  SUPPORT_TICKETS,
  SETTLEMENTS,
  AUDIT_LOGS,
  NOTIFICATIONS,
} from "../mocks/mockData";
import type { Admin } from "../types/admin";
import type { Customer } from "../types/customer";
import type { Service, ServiceCategory } from "../types/service";
import type { Partner, Verification } from "../types/partner";
import type { Booking, Assignment } from "../types/booking";
import type { Payment, Refund, Settlement } from "../types/payment";
import type { Dispute } from "../types/dispute";
import type { SupportTicket } from "../types/support";
import type { AuditLog, Notification } from "../types/audit";

// In-memory state store mimicking backend database
class MockStore {
  admins: Admin[] = [...INITIAL_ADMINS];
  categories: ServiceCategory[] = [...SERVICE_CATEGORIES];
  services: Service[] = [...SERVICES];
  customers: Customer[] = [...CUSTOMERS];
  partners: Partner[] = [...PARTNERS];
  verifications: Verification[] = [...VERIFICATIONS];
  bookings: Booking[] = [...BOOKINGS];
  assignments: Assignment[] = [...ASSIGNMENTS];
  payments: Payment[] = [...PAYMENTS];
  refunds: Refund[] = [...REFUNDS];
  disputes: Dispute[] = [...DISPUTES];
  tickets: SupportTicket[] = [...SUPPORT_TICKETS];
  settlements: Settlement[] = [...SETTLEMENTS];
  auditLogs: AuditLog[] = [...AUDIT_LOGS];
  notifications: Notification[] = [...NOTIFICATIONS];

  addAuditLog(log: Omit<AuditLog, "id" | "timestamp">) {
    const newLog: AuditLog = {
      ...log,
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    this.auditLogs.unshift(newLog);
  }
}

export const mockStore = new MockStore();
