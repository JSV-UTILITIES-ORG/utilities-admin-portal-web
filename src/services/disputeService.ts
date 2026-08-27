import { mockStore } from "./mockStore";
import type { Dispute, DisputeStatus } from "../types/dispute";

export const disputeService = {
  async getDisputes(status?: DisputeStatus | "ALL"): Promise<Dispute[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!status || status === "ALL") {
      return [...mockStore.disputes];
    }
    return mockStore.disputes.filter((d) => d.status === status);
  },

  async getDisputeById(id: string): Promise<Dispute | null> {
    await new Promise((r) => setTimeout(r, 100));
    return mockStore.disputes.find((d) => d.id === id) || null;
  },

  async resolveDispute(
    id: string,
    resolution: string,
    adminName: string,
  ): Promise<Dispute> {
    await new Promise((r) => setTimeout(r, 150));
    const dispute = mockStore.disputes.find((d) => d.id === id);
    if (!dispute) throw new Error("Dispute not found");

    const prevStatus = dispute.status;
    dispute.status = "RESOLVED";
    dispute.resolution = resolution;
    dispute.resolvedAt = new Date()
      .toISOString()
      .replace("T", " ")
      .slice(0, 16);
    dispute.updatedAt = dispute.resolvedAt;

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "DISPUTE_RESOLVED",
      entity: "Dispute",
      entityId: id,
      previousValue: prevStatus,
      newValue: "RESOLVED",
      reason: resolution,
      ipAddress: "127.0.0.1",
    });

    return { ...dispute };
  },

  async escalateDispute(
    id: string,
    reason: string,
    adminName: string,
  ): Promise<Dispute> {
    await new Promise((r) => setTimeout(r, 150));
    const dispute = mockStore.disputes.find((d) => d.id === id);
    if (!dispute) throw new Error("Dispute not found");

    dispute.status = "ESCALATED";
    dispute.priority = "CRITICAL";
    dispute.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "DISPUTE_ESCALATED",
      entity: "Dispute",
      entityId: id,
      newValue: "ESCALATED",
      reason,
      ipAddress: "127.0.0.1",
    });

    return { ...dispute };
  },
};
