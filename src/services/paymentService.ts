import { mockStore } from "./mockStore";
import type { Payment, PaymentStatus } from "../types/payment";

export const paymentService = {
  async getPayments(status?: PaymentStatus | "ALL"): Promise<Payment[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!status || status === "ALL") {
      return [...mockStore.payments];
    }
    return mockStore.payments.filter((p) => p.status === status);
  },

  async getPaymentById(id: string): Promise<Payment | null> {
    await new Promise((r) => setTimeout(r, 100));
    return mockStore.payments.find((p) => p.id === id) || null;
  },

  async retryPayment(id: string, adminName: string): Promise<Payment> {
    await new Promise((r) => setTimeout(r, 200));
    const payment = mockStore.payments.find((p) => p.id === id);
    if (!payment) throw new Error("Payment not found");

    const prevStatus = payment.status;
    payment.status = "SUCCESS";
    payment.reference = `RETRY-SUCCESS-${Date.now().toString().slice(-6)}`;
    payment.failureReason = undefined;
    payment.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    // Update associated booking
    const booking = mockStore.bookings.find((b) => b.id === payment.bookingId);
    if (booking && booking.status === "PAYMENT_FAILED") {
      booking.status = "PAYMENT_COMPLETED";
      booking.paymentStatus = "SUCCESS";
    }

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "PAYMENT_RETRY_TRIGGERED",
      entity: "Payment",
      entityId: id,
      previousValue: prevStatus,
      newValue: "SUCCESS",
      reason: "Manual gateway retry reconciliation by admin",
      ipAddress: "127.0.0.1",
    });

    return { ...payment };
  },
};
