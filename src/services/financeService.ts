import { mockStore } from "./mockStore";
import type { Settlement, SettlementStatus, PGCommissionRecord } from "../types/payment";

export interface FinancialSummary {
  grossGMV: number;
  serviceCommissionRevenue: number;
  pgCommissionRevenue: number;
  totalPlatformRevenue: number;
  partnerPayoutsPaid: number;
  partnerPayoutsPending: number;
  totalRefunds: number;
  failedPaymentAmount: number;
}

export const financeService = {
  async getFinancialSummary(): Promise<FinancialSummary> {
    await new Promise((r) => setTimeout(r, 80));
    const grossGMV = 1420000;
    const serviceCommissionRevenue = 213000; // ~15% commission on services
    const pgCommissionRevenue = mockStore.pgCommissions
      .filter((c) => c.status === "COLLECTED")
      .reduce((acc, c) => acc + c.commissionAmount, 0) + 3575;
    const totalPlatformRevenue = serviceCommissionRevenue + pgCommissionRevenue;
    const partnerPayoutsPaid = 980000;
    const partnerPayoutsPending = 64500;
    const totalRefunds =
      mockStore.refunds
        .filter((r) => r.status === "APPROVED")
        .reduce((acc, r) => acc + r.amount, 0) + 4498;
    const failedPaymentAmount = mockStore.payments
      .filter((p) => p.status === "FAILED")
      .reduce((acc, p) => acc + p.amount, 0);

    return {
      grossGMV,
      serviceCommissionRevenue,
      pgCommissionRevenue,
      totalPlatformRevenue,
      partnerPayoutsPaid,
      partnerPayoutsPending,
      totalRefunds,
      failedPaymentAmount,
    };
  },

  async getSettlements(status?: SettlementStatus | "ALL"): Promise<Settlement[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (!status || status === "ALL") {
      return [...mockStore.settlements];
    }
    return mockStore.settlements.filter((s) => s.status === status);
  },

  async getPGCommissions(): Promise<PGCommissionRecord[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [...mockStore.pgCommissions];
  },

  async disburseSettlement(id: string, adminName = "Super Admin"): Promise<Settlement> {
    await new Promise((r) => setTimeout(r, 120));
    const item = mockStore.settlements.find((s) => s.id === id);
    if (!item) throw new Error("Settlement record not found");

    item.status = "SETTLED";
    item.settlementDate = new Date().toISOString().replace("T", " ").slice(0, 16);

    mockStore.addAuditLog({
      adminId: "ADM-001",
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

  async markPGCommissionCollected(
    id: string,
    adminName = "Super Admin"
  ): Promise<PGCommissionRecord> {
    await new Promise((r) => setTimeout(r, 100));
    const comm = mockStore.pgCommissions.find((c) => c.id === id);
    if (!comm) throw new Error(`Commission record ${id} not found`);

    comm.status = "COLLECTED";
    comm.collectedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    mockStore.addAuditLog({
      adminId: "ADM-001",
      adminName,
      action: "COLLECT_PG_COMMISSION",
      entity: "PG_COMMISSION",
      entityId: id,
      newValue: `Collected: ₹${comm.totalReceivable}`,
      ipAddress: "127.0.0.1",
    });

    return { ...comm };
  },
};
