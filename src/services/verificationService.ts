import { mockStore } from "./mockStore";
import type { Verification, VerificationStatus } from "../types/partner";

export const verificationService = {
  async getVerifications(
    status?: VerificationStatus | "ALL",
  ): Promise<Verification[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!status || status === "ALL") {
      return [...mockStore.verifications];
    }
    return mockStore.verifications.filter((v) => v.status === status);
  },

  async getVerificationById(id: string): Promise<Verification | null> {
    await new Promise((r) => setTimeout(r, 100));
    return mockStore.verifications.find((v) => v.id === id) || null;
  },

  async approveVerification(
    id: string,
    adminName: string,
    notes?: string,
  ): Promise<Verification> {
    await new Promise((r) => setTimeout(r, 150));
    const ver = mockStore.verifications.find((v) => v.id === id);
    if (!ver) throw new Error("Verification not found");

    ver.status = "APPROVED";
    ver.reviewedAt = new Date().toISOString().replace("T", " ").slice(0, 16);
    ver.assignedTo = adminName;
    if (notes) ver.notes = notes;

    // Also activate the partner
    const partner = mockStore.partners.find((p) => p.id === ver.partnerId);
    if (partner) {
      partner.verificationStatus = "APPROVED";
      partner.status = "ACTIVE";
    }

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "PARTNER_VERIFIED_AND_ACTIVATED",
      entity: "Verification",
      entityId: id,
      previousValue: "PENDING",
      newValue: "APPROVED",
      reason: notes || "Documents and background criteria satisfied",
      ipAddress: "127.0.0.1",
    });

    return { ...ver };
  },

  async rejectVerification(
    id: string,
    reason: string,
    adminName: string,
  ): Promise<Verification> {
    await new Promise((r) => setTimeout(r, 150));
    const ver = mockStore.verifications.find((v) => v.id === id);
    if (!ver) throw new Error("Verification not found");

    ver.status = "REJECTED";
    ver.reviewedAt = new Date().toISOString().replace("T", " ").slice(0, 16);
    ver.assignedTo = adminName;
    ver.notes = reason;

    const partner = mockStore.partners.find((p) => p.id === ver.partnerId);
    if (partner) {
      partner.verificationStatus = "REJECTED";
      partner.status = "REJECTED";
      partner.rejectionReason = reason;
    }

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "PARTNER_VERIFICATION_REJECTED",
      entity: "Verification",
      entityId: id,
      previousValue: "PENDING",
      newValue: "REJECTED",
      reason,
      ipAddress: "127.0.0.1",
    });

    return { ...ver };
  },

  async requestMoreInfo(
    id: string,
    requirements: string,
    adminName: string,
  ): Promise<Verification> {
    await new Promise((r) => setTimeout(r, 150));
    const ver = mockStore.verifications.find((v) => v.id === id);
    if (!ver) throw new Error("Verification not found");

    ver.status = "MORE_INFO_REQUIRED";
    ver.notes = requirements;
    ver.assignedTo = adminName;

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "PARTNER_MORE_INFO_REQUESTED",
      entity: "Verification",
      entityId: id,
      newValue: "MORE_INFO_REQUIRED",
      reason: requirements,
      ipAddress: "127.0.0.1",
    });

    return { ...ver };
  },
};
