import { mockStore } from "./mockStore";
import type { Refund, RefundStatus } from "../types/payment";

export const refundService = {
  async getRefunds(status?: RefundStatus | "ALL"): Promise<Refund[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!status || status === "ALL") {
      return [...mockStore.refunds];
    }
    return mockStore.refunds.filter((r) => r.status === status);
  },

  async approveRefund(id: string, adminName: string): Promise<Refund> {
    await new Promise((r) => setTimeout(r, 150));
    const refund = mockStore.refunds.find((r) => r.id === id);
    if (!refund) throw new Error("Refund not found");

    refund.status = "APPROVED";
    refund.reviewedAt = new Date().toISOString().replace("T", " ").slice(0, 16);
    refund.reviewedBy = adminName;

    // Update associated payment and booking
    const payment = mockStore.payments.find((p) => p.id === refund.paymentId);
    if (payment) payment.status = "REFUNDED";

    const booking = mockStore.bookings.find((b) => b.id === refund.bookingId);
    if (booking) booking.paymentStatus = "REFUNDED";

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "REFUND_APPROVED",
      entity: "Refund",
      entityId: id,
      previousValue: "REQUESTED",
      newValue: "APPROVED",
      reason: `Approved refund of ₹${refund.amount} for customer ${refund.customerName}`,
      ipAddress: "127.0.0.1",
    });

    return { ...refund };
  },

  async rejectRefund(
    id: string,
    reason: string,
    adminName: string,
  ): Promise<Refund> {
    await new Promise((r) => setTimeout(r, 150));
    const refund = mockStore.refunds.find((r) => r.id === id);
    if (!refund) throw new Error("Refund not found");

    refund.status = "REJECTED";
    refund.reviewedAt = new Date().toISOString().replace("T", " ").slice(0, 16);
    refund.reviewedBy = adminName;
    refund.rejectionReason = reason;

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "REFUND_REJECTED",
      entity: "Refund",
      entityId: id,
      previousValue: "REQUESTED",
      newValue: "REJECTED",
      reason,
      ipAddress: "127.0.0.1",
    });

    return { ...refund };
  },
};
