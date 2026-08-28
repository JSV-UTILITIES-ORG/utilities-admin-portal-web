import { mockStore } from "./mockStore";

export interface ActionRequiredItem {
  id: string;
  type:
    | "VERIFICATION"
    | "ASSIGNMENT_FAILURE"
    | "PAYMENT_FAILURE"
    | "OPEN_DISPUTE"
    | "SLA_BREACH"
    | "REFUND_REQUEST"
    | "JOB_MODERATION"
    | "PG_VERIFICATION";
  title: string;
  count: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  description: string;
  actionLabel: string;
  actionRoute: string;
  affectedAmount?: number;
}

export interface PendingOperationsItem {
  id: string;
  title: string;
  count: number;
  route: string;
  category: string;
}

interface BusinessOverview {
  totalBookings: number;
  revenue: number;
  totalUsers: number;
  activePartners: number;
  completedServices: number;
  cancelledServices: number;
  revenueGrowth: number;
  bookingGrowth: number;
  // 3-Marketplace additions (BRD Section 7.1)
  pendingJobsModeration: number;
  publishedJobsCount: number;
  pendingPGVerification: number;
  totalPGBedsAvailable: number;
  pgJoinsCount: number;
  totalCommissionRevenue: number;
}

export const dashboardService = {
  async getDashboardData() {
    await new Promise((r) => setTimeout(r, 80));

    // Calculate actual metrics from mock store across all 3 marketplaces
    const pendingVerifications = mockStore.verifications.filter(
      (v) => v.status === "PENDING" || v.status === "IN_REVIEW"
    ).length;
    const assignmentFailures = mockStore.assignments.filter(
      (a) => a.status === "FAILED"
    ).length;
    const failedPayments = mockStore.payments.filter((p) => p.status === "FAILED");
    const failedPaymentCount = failedPayments.length;
    const failedPaymentAmount = failedPayments.reduce((acc, p) => acc + p.amount, 0);
    const openDisputes = mockStore.disputes.filter(
      (d) => d.status === "OPEN" || d.status === "ESCALATED"
    ).length;
    const slaBreaches = mockStore.tickets.filter(
      (t) => t.slaBreached && (t.status === "OPEN" || t.status === "IN_PROGRESS")
    ).length;
    const refundRequests = mockStore.refunds.filter((r) => r.status === "REQUESTED").length;

    // Jobs & PG queues
    const pendingJobModerations = mockStore.jobs.filter((j) => j.status === "SUBMITTED").length;
    const pendingPGVerifications = mockStore.accommodations.filter(
      (a) => a.status === "UNDER_REVIEW" || a.status === "SUBMITTED"
    ).length;
    const totalPGBeds = mockStore.accommodations.reduce((acc, a) => acc + a.availableBeds, 0);
    const totalPGJoins = mockStore.pgJoinings.length;
    const totalCommission = mockStore.pgCommissions.reduce((acc, c) => acc + c.commissionAmount, 0) + 187200;

    const actionRequired: ActionRequiredItem[] = [
      {
        id: "ACT-1",
        type: "VERIFICATION",
        title: "Partner KYC Verification",
        count: pendingVerifications,
        severity: "HIGH",
        description: "New service partners awaiting document review & automated KYC",
        actionLabel: "Review",
        actionRoute: "/verification?status=PENDING",
      },
      {
        id: "ACT-JOB",
        type: "JOB_MODERATION",
        title: "Partner Jobs Moderation",
        count: pendingJobModerations,
        severity: "HIGH",
        description: "Partner workforce job posts requiring Admin review before publishing",
        actionLabel: "Moderate",
        actionRoute: "/jobs?status=SUBMITTED",
      },
      {
        id: "ACT-PG",
        type: "PG_VERIFICATION",
        title: "PG Listing Checklist",
        count: pendingPGVerifications,
        severity: "MEDIUM",
        description: "New accommodation properties pending physical & legal verification",
        actionLabel: "Inspect",
        actionRoute: "/accommodations?status=UNDER_REVIEW",
      },
      {
        id: "ACT-2",
        type: "ASSIGNMENT_FAILURE",
        title: "Assignment Failures",
        count: assignmentFailures,
        severity: "CRITICAL",
        description: "Bookings unassigned past matching SLA window",
        actionLabel: "Assign",
        actionRoute: "/assignments?status=FAILED",
      },
      {
        id: "ACT-3",
        type: "PAYMENT_FAILURE",
        title: "Payment Failures",
        count: failedPaymentCount,
        severity: "CRITICAL",
        description: `${failedPaymentCount} failed transactions affected`,
        actionLabel: "Review",
        actionRoute: "/payments?status=FAILED",
        affectedAmount: failedPaymentAmount,
      },
      {
        id: "ACT-4",
        type: "OPEN_DISPUTE",
        title: "Open Disputes",
        count: openDisputes,
        severity: "HIGH",
        description: "Customer service quality & billing disputes requiring resolution",
        actionLabel: "Review",
        actionRoute: "/disputes?status=OPEN",
      },
      {
        id: "ACT-5",
        type: "SLA_BREACH",
        title: "Support SLA Breaches",
        count: slaBreaches,
        severity: "CRITICAL",
        description: "Emergency customer tickets breached resolution SLA",
        actionLabel: "View",
        actionRoute: "/support?sla=BREACHED",
      },
      {
        id: "ACT-6",
        type: "REFUND_REQUEST",
        title: "Refund Requests",
        count: refundRequests,
        severity: "MEDIUM",
        description: "Customer claims requiring refund review and settlement approval",
        actionLabel: "Review",
        actionRoute: "/refunds?status=REQUESTED",
      },
    ];

    const pendingOperations: PendingOperationsItem[] = [
      {
        id: "POP-1",
        title: "Partner Approvals",
        count: pendingVerifications,
        route: "/verification?status=PENDING",
        category: "Partners",
      },
      {
        id: "POP-JOB",
        title: "Partner Job Posts",
        count: pendingJobModerations,
        route: "/jobs?status=SUBMITTED",
        category: "Work Marketplace",
      },
      {
        id: "POP-PG",
        title: "PG Listing Reviews",
        count: pendingPGVerifications,
        route: "/accommodations?status=UNDER_REVIEW",
        category: "Accommodation",
      },
      {
        id: "POP-4",
        title: "Refund Requests",
        count: refundRequests,
        route: "/refunds?status=REQUESTED",
        category: "Finance",
      },
      {
        id: "POP-5",
        title: "Pending Service Requests",
        count: 6,
        route: "/bookings?status=AWAITING_ASSIGNMENT",
        category: "Operations",
      },
    ];

    const businessOverview: BusinessOverview = {
      totalBookings: 1248,
      revenue: 842500,
      totalUsers: 3420,
      activePartners: mockStore.partners.filter((p) => p.status === "ACTIVE").length + 42,
      completedServices: 1120,
      cancelledServices: 34,
      revenueGrowth: 18.4,
      bookingGrowth: 14.2,
      pendingJobsModeration: pendingJobModerations,
      publishedJobsCount: mockStore.jobs.filter((j) => j.status === "PUBLISHED").length,
      pendingPGVerification: pendingPGVerifications,
      totalPGBedsAvailable: totalPGBeds,
      pgJoinsCount: totalPGJoins,
      totalCommissionRevenue: totalCommission,
    };

    const recentActivity = mockStore.auditLogs.slice(0, 7);

    return {
      actionRequired,
      pendingOperations,
      businessOverview,
      recentActivity,
    };
  },
};
