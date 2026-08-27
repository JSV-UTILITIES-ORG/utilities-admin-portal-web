import { mockStore } from "./mockStore";

export interface ActionRequiredItem {
  id: string;
  type:
    | "VERIFICATION"
    | "ASSIGNMENT_FAILURE"
    | "PAYMENT_FAILURE"
    | "OPEN_DISPUTE"
    | "SLA_BREACH"
    | "REFUND_REQUEST";
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
}

export const dashboardService = {
  async getDashboardData() {
    await new Promise((r) => setTimeout(r, 100));

    // Calculate actual metrics from mock store
    const pendingVerifications = mockStore.verifications.filter(
      (v) => v.status === "PENDING",
    ).length;
    const assignmentFailures = mockStore.assignments.filter(
      (a) => a.status === "FAILED",
    ).length;
    const failedPayments = mockStore.payments.filter(
      (p) => p.status === "FAILED",
    );
    const failedPaymentCount = failedPayments.length;
    const failedPaymentAmount = failedPayments.reduce(
      (acc, p) => acc + p.amount,
      0,
    );
    const openDisputes = mockStore.disputes.filter(
      (d) => d.status === "OPEN" || d.status === "ESCALATED",
    ).length;
    const slaBreaches = mockStore.tickets.filter(
      (t) =>
        t.slaBreached && (t.status === "OPEN" || t.status === "IN_PROGRESS"),
    ).length;
    const refundRequests = mockStore.refunds.filter(
      (r) => r.status === "REQUESTED",
    ).length;

    const actionRequired: ActionRequiredItem[] = [
      {
        id: "ACT-1",
        type: "VERIFICATION",
        title: "Partner Verification",
        count: pendingVerifications,
        severity: "HIGH",
        description: "New service partners awaiting document review & KYC",
        actionLabel: "Review",
        actionRoute: "/verification?status=PENDING",
      },
      {
        id: "ACT-2",
        type: "ASSIGNMENT_FAILURE",
        title: "Assignment Failures",
        count: assignmentFailures,
        severity: "CRITICAL",
        description: "Bookings unassigned past 45-min matching SLA window",
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
        description:
          "Customer service quality & billing disputes requiring resolution",
        actionLabel: "Review",
        actionRoute: "/disputes?status=OPEN",
      },
      {
        id: "ACT-5",
        type: "SLA_BREACH",
        title: "Support SLA Breaches",
        count: slaBreaches,
        severity: "CRITICAL",
        description:
          "Emergency and critical customer tickets breached resolution SLA",
        actionLabel: "View",
        actionRoute: "/support?sla=BREACHED",
      },
      {
        id: "ACT-6",
        type: "REFUND_REQUEST",
        title: "Refund Requests",
        count: refundRequests,
        severity: "MEDIUM",
        description:
          "Customer claims requiring refund review and settlement approval",
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
        id: "POP-2",
        title: "KYC Verification",
        count: 5,
        route: "/verification?type=KYC",
        category: "Verification",
      },
      {
        id: "POP-3",
        title: "Document Reviews",
        count: 8,
        route: "/verification?type=DOCS",
        category: "Verification",
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
      activePartners:
        mockStore.partners.filter((p) => p.status === "ACTIVE").length + 42,
      completedServices: 1120,
      cancelledServices: 34,
      revenueGrowth: 18.4,
      bookingGrowth: 14.2,
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
