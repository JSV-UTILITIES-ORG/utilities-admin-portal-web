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
import { INITIAL_JOB_POSTS, INITIAL_JOB_APPLICATIONS } from "../mocks/jobMockData";
import {
  INITIAL_ACCOMMODATIONS,
  INITIAL_PG_ENQUIRIES,
  INITIAL_PG_VISITS,
  INITIAL_PG_JOININGS,
  INITIAL_PG_COMMISSIONS,
} from "../mocks/accommodationMockData";
import { INITIAL_SUBCATEGORIES, INITIAL_PACKAGES } from "../mocks/catalogueMockData";

import type { Admin } from "../types/admin";
import type { Customer } from "../types/customer";
import type { Service, ServiceCategory, ServiceSubcategory, ServicePackage } from "../types/service";
import type { Partner, Verification } from "../types/partner";
import type { Booking, Assignment } from "../types/booking";
import type { Payment, Refund, Settlement, PGCommissionRecord } from "../types/payment";
import type { Dispute } from "../types/dispute";
import type { SupportTicket } from "../types/support";
import type { AuditLog, Notification } from "../types/audit";
import type { JobPost, JobApplication } from "../types/job";
import type { AccommodationListing, PGEnquiry, PGVisit, PGJoining } from "../types/accommodation";

// In-memory state store mimicking backend database across all 3 marketplaces
class MockStore {
  admins: Admin[] = [...INITIAL_ADMINS];
  categories: ServiceCategory[] = [...SERVICE_CATEGORIES];
  subcategories: ServiceSubcategory[] = [...INITIAL_SUBCATEGORIES];
  packages: ServicePackage[] = [...INITIAL_PACKAGES];
  services: Service[] = [...SERVICES];
  customers: Customer[] = [...CUSTOMERS];
  partners: Partner[] = PARTNERS.map((p) => ({
    ...p,
    capabilities: p.capabilities || {
      findWork: true,
      createJobs: p.id === "PRT-004" || p.id === "PRT-002" || p.id === "PRT-006",
      hostAccommodation: p.id === "PRT-010" || p.id === "PRT-011" || p.id === "PRT-012",
    },
    realtimeVerification: p.realtimeVerification || {
      aadhaarVerified: true,
      aadhaarMatchScore: 97,
      panVerified: true,
      panMatchScore: 94,
      bankVerified: true,
      bankBeneficiaryName: p.name,
      faceMatchScore: 98,
      overallConfidence: "HIGH",
      verifiedAt: p.joinedAt,
    },
  }));
  verifications: Verification[] = VERIFICATIONS.map((v) => ({
    ...v,
    capabilities: { findWork: true, createJobs: false, hostAccommodation: false },
    realtimeVerification: {
      aadhaarVerified: true,
      aadhaarMatchScore: 95,
      panVerified: true,
      panMatchScore: 91,
      bankVerified: true,
      bankBeneficiaryName: v.partnerName,
      faceMatchScore: 96,
      overallConfidence: "HIGH",
      verifiedAt: v.submittedAt,
    },
  }));
  bookings: Booking[] = BOOKINGS.map((b, idx) => ({
    ...b,
    additionalCharge:
      idx === 1
        ? {
            id: "CHG-801",
            amount: 850,
            reason: "R32 Refrigerant Gas Refill & Valve Seal",
            description: "Condenser valve was leaking, tightened and added 400g gas.",
            photos: [
              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
            ],
            status: "PENDING",
            requestedAt: "2026-08-28 14:15",
          }
        : undefined,
    beforePhotos: [
      {
        id: `P-BEF-${b.id}`,
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
        type: "BEFORE",
        caption: "Condition before commencing service",
        uploadedAt: b.createdAt,
      },
    ],
    afterPhotos: [
      {
        id: `P-AFT-${b.id}`,
        url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80",
        type: "AFTER",
        caption: "Work completed and tested",
        uploadedAt: b.updatedAt,
      },
    ],
  }));
  assignments: Assignment[] = [...ASSIGNMENTS];
  payments: Payment[] = [...PAYMENTS];
  refunds: Refund[] = [...REFUNDS];
  disputes: Dispute[] = [...DISPUTES];
  tickets: SupportTicket[] = [...SUPPORT_TICKETS];
  settlements: Settlement[] = [...SETTLEMENTS];
  auditLogs: AuditLog[] = [...AUDIT_LOGS];
  notifications: Notification[] = [...NOTIFICATIONS];

  // Work Marketplace (Partner Jobs)
  jobs: JobPost[] = [...INITIAL_JOB_POSTS];
  jobApplications: JobApplication[] = [...INITIAL_JOB_APPLICATIONS];

  // Accommodation Marketplace (PG / Stays)
  accommodations: AccommodationListing[] = [...INITIAL_ACCOMMODATIONS];
  pgEnquiries: PGEnquiry[] = [...INITIAL_PG_ENQUIRIES];
  pgVisits: PGVisit[] = [...INITIAL_PG_VISITS];
  pgJoinings: PGJoining[] = [...INITIAL_PG_JOININGS];
  pgCommissions: PGCommissionRecord[] = [...INITIAL_PG_COMMISSIONS];

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
