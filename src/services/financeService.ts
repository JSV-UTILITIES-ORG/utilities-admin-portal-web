import { mockStore } from "./mockStore";
import type { Settlement, SettlementStatus } from "../types/payment";

export interface FinancialSummary {
  grossGMV: number;
  platformRevenue: number;
  partnerPayoutsPaid: number;
  partnerPayoutsPending: number;
  totalRefunds: number;
  failedPaymentAmount: number;
}

export const financeService = {
  async getFinancialSummary(): Promise<FinancialSummary> {
    await new Promise((r) => setTimeout(r, 100));
    const grossGMV = 1248000;
    const platformRevenue = 187200; // ~15% commission
    const partnerPayoutsPaid = 842000;
    const partnerPayoutsPending = 78500;
    const totalRefunds =
      mockStore.refunds
        .filter((r) => r.status === "APPROVED")
        .reduce((acc, r) => acc + r.amount, 0) + 4498;
    const failedPaymentAmount = mockStore.payments
      .filter((p) => p.status === "FAILED")
      .reduce((acc, p) => acc + p.amount, 0);

    return {
      grossGMV,
      platformRevenue,
      partnerPayoutsPaid,
      partnerPayoutsPending,
      totalRefunds,
      failedPaymentAmount,
    };
  },

  async getSettlements(
    status?: SettlementStatus | "ALL",
  ): Promise<Settlement[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!status || status === "ALL") {
      return [...mockStore.settlements];
    }
    return mockStore.settlements.filter((s) => s.status === status);
  },

  async disburseSettlement(id: string, adminName: string): Promise<Settlement> {
    await new Promise((r) => setTimeout(r, 150));
    const item = mockStore.settlements.find((s) => s.id === id);
    if (!item) throw new Error("Settlement record not found");

    item.status = "SETTLED";
    item.settlementDate = new Date()
      .toISOString()
      .replace("T", " ")
      .slice(0, 16);

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "PARTNER_SETTLEMENT_EXECUTED",
      entity: "Settlement",
      entityId: id,
      previousValue: "PENDING",
      newValue: "SETTLED",
      reason: `Settled ₹${item.partnerAmount} to partner ${item.partnerName}`,
      ipAddress: "127.0.0.1",
    });

    return { ...item };
  },

  async processSettlement(id: string, adminName: string): Promise<Settlement> {
    return this.disburseSettlement(id, adminName);
  },
};
