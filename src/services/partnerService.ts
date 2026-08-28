import { mockStore } from "./mockStore";
import type {
  Partner,
  PartnerStatus,
  VerificationStatus,
} from "../types/partner";

export interface PartnerFilters {
  search?: string;
  status?: PartnerStatus | "ALL";
  verificationStatus?: VerificationStatus | "ALL";
  category?: string;
  city?: string;
}

export const partnerService = {
  async getPartners(filters?: PartnerFilters): Promise<Partner[]> {
    await new Promise((r) => setTimeout(r, 100));
    let list = [...mockStore.partners];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.mobile.includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.services.some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((p) => p.status === filters.status);
    }

    if (filters?.verificationStatus && filters.verificationStatus !== "ALL") {
      list = list.filter(
        (p) => p.verificationStatus === filters.verificationStatus,
      );
    }

    if (filters?.city && filters.city !== "ALL") {
      list = list.filter((p) => p.city === filters.city);
    }

    return list;
  },

  async getPartnerById(id: string): Promise<Partner | null> {
    await new Promise((r) => setTimeout(r, 100));
    return mockStore.partners.find((p) => p.id === id) || null;
  },

  async updatePartnerStatus(
    id: string,
    newStatus: PartnerStatus,
    reason: string,
    adminName: string,
  ): Promise<Partner> {
    await new Promise((r) => setTimeout(r, 150));
    const partner = mockStore.partners.find((p) => p.id === id);
    if (!partner) throw new Error("Partner not found");

    const prevStatus = partner.status;
    partner.status = newStatus;
    if (newStatus === "SUSPENDED" || newStatus === "REJECTED") {
      partner.rejectionReason = reason;
    }

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: `PARTNER_STATUS_${newStatus}`,
      entity: "Partner",
      entityId: id,
      previousValue: prevStatus,
      newValue: newStatus,
      reason,
      ipAddress: "127.0.0.1",
    });

    return { ...partner };
  },

  async suspendPartner(id: string, reason: string, adminName: string): Promise<Partner> {
    return this.updatePartnerStatus(id, "SUSPENDED", reason, adminName);
  },

  async activatePartner(id: string, reason: string, adminName: string): Promise<Partner> {
    return this.updatePartnerStatus(id, "ACTIVE", reason, adminName);
  },
};
