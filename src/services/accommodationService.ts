import { mockStore } from "./mockStore";
import type {
  AccommodationListing,
  AccommodationStatus,
  PGEnquiry,
  PGVisit,
  PGJoining,
  VerificationChecklist,
} from "../types/accommodation";
import type { PGCommissionRecord } from "../types/payment";

export interface AccommodationFilters {
  search?: string;
  status?: AccommodationStatus | "ALL";
  city?: string;
  gender?: string;
}

export const accommodationService = {
  async getAccommodations(
    filters?: AccommodationFilters,
  ): Promise<AccommodationListing[]> {
    await new Promise((r) => setTimeout(r, 80));
    let list = [...mockStore.accommodations];

    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters?.city && filters.city !== "ALL") {
      list = list.filter(
        (a) => a.city.toLowerCase() === filters.city?.toLowerCase(),
      );
    }
    if (filters?.gender && filters.gender !== "ALL") {
      list = list.filter((a) => a.genderAllowed === filters.gender);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.propertyName.toLowerCase().includes(q) ||
          a.ownerName.toLowerCase().includes(q) ||
          a.area.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q),
      );
    }
    return list;
  },

  async getAccommodationById(id: string): Promise<AccommodationListing | null> {
    await new Promise((r) => setTimeout(r, 50));
    const item = mockStore.accommodations.find((a) => a.id === id);
    return item ? { ...item } : null;
  },

  async verifyAndPublishListing(
    listingId: string,
    checklist: VerificationChecklist,
    adminId = "ADM-001",
  ): Promise<AccommodationListing> {
    await new Promise((r) => setTimeout(r, 100));
    const item = mockStore.accommodations.find((a) => a.id === listingId);
    if (!item) throw new Error(`Listing ${listingId} not found`);

    const now = new Date().toISOString().replace("T", " ").slice(0, 16);
    item.verificationChecklist = {
      ...checklist,
      verifiedBy: adminId,
      verifiedAt: now,
    };
    item.status = "PUBLISHED";
    item.verifiedAt = now;
    item.updatedAt = now;

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "VERIFY_AND_PUBLISH_PG_LISTING",
      entity: "ACCOMMODATION",
      entityId: listingId,
      newValue: "PUBLISHED",
      ipAddress: "127.0.0.1",
    });

    return { ...item };
  },

  async rejectListing(
    listingId: string,
    reason: string,
    adminId = "ADM-001",
  ): Promise<AccommodationListing> {
    await new Promise((r) => setTimeout(r, 100));
    const item = mockStore.accommodations.find((a) => a.id === listingId);
    if (!item) throw new Error(`Listing ${listingId} not found`);

    item.status = "REJECTED";
    item.rejectionReason = reason;
    item.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "REJECT_PG_LISTING",
      entity: "ACCOMMODATION",
      entityId: listingId,
      newValue: `REJECTED: ${reason}`,
      ipAddress: "127.0.0.1",
    });

    return { ...item };
  },

  async suspendListing(
    listingId: string,
    adminId = "ADM-001",
  ): Promise<AccommodationListing> {
    await new Promise((r) => setTimeout(r, 80));
    const item = mockStore.accommodations.find((a) => a.id === listingId);
    if (!item) throw new Error(`Listing ${listingId} not found`);

    item.status = "SUSPENDED";
    item.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "SUSPEND_PG_LISTING",
      entity: "ACCOMMODATION",
      entityId: listingId,
      newValue: "SUSPENDED",
      ipAddress: "127.0.0.1",
    });

    return { ...item };
  },

  // Enquiries & Visits Management
  async getEnquiries(listingId?: string): Promise<PGEnquiry[]> {
    await new Promise((r) => setTimeout(r, 50));
    if (listingId)
      return mockStore.pgEnquiries.filter((e) => e.listingId === listingId);
    return [...mockStore.pgEnquiries];
  },

  async createEnquiry(
    data: Omit<PGEnquiry, "id" | "createdAt" | "status">,
  ): Promise<PGEnquiry> {
    await new Promise((r) => setTimeout(r, 80));
    const newEnquiry: PGEnquiry = {
      ...data,
      id: `ENQ-${Date.now().toString().slice(-4)}`,
      status: "NEW",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    mockStore.pgEnquiries.unshift(newEnquiry);
    const listing = mockStore.accommodations.find(
      (a) => a.id === data.listingId,
    );
    if (listing) listing.enquiriesCount += 1;
    return newEnquiry;
  },

  async acceptEnquiry(enquiryId: string, notes?: string): Promise<PGEnquiry> {
    await new Promise((r) => setTimeout(r, 80));
    const enq = mockStore.pgEnquiries.find((e) => e.id === enquiryId);
    if (!enq) throw new Error("Enquiry not found");
    enq.status = "CONTACTED";
    if (notes)
      enq.message = `${enq.message ? enq.message + " | " : ""}Admin Response: ${notes}`;
    return { ...enq };
  },

  async scheduleVisitFromEnquiry(
    enquiryId: string,
    scheduledDate: string,
    timeSlot: string,
    notes?: string,
  ): Promise<{ enquiry: PGEnquiry; visit: PGVisit }> {
    await new Promise((r) => setTimeout(r, 100));
    const enq = mockStore.pgEnquiries.find((e) => e.id === enquiryId);
    if (!enq) throw new Error("Enquiry not found");
    enq.status = "VISIT_SCHEDULED";

    const newVisit: PGVisit = {
      id: `VST-${Date.now().toString().slice(-4)}`,
      listingId: enq.listingId,
      propertyName: enq.propertyName,
      userId: enq.userId,
      userName: enq.userName,
      userMobile: enq.userMobile,
      scheduledDate,
      timeSlot,
      status: "CONFIRMED",
      notes: notes || "Visit scheduled following accepted enquiry.",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    mockStore.pgVisits.unshift(newVisit);

    const listing = mockStore.accommodations.find(
      (a) => a.id === enq.listingId,
    );
    if (listing) listing.visitsCount += 1;

    return { enquiry: { ...enq }, visit: newVisit };
  },

  async rejectEnquiry(enquiryId: string, reason?: string): Promise<PGEnquiry> {
    await new Promise((r) => setTimeout(r, 80));
    const enq = mockStore.pgEnquiries.find((e) => e.id === enquiryId);
    if (!enq) throw new Error("Enquiry not found");
    enq.status = "DROPPED";
    if (reason)
      enq.message = `${enq.message ? enq.message + " | " : ""}Closed reason: ${reason}`;
    return { ...enq };
  },

  async getVisits(listingId?: string): Promise<PGVisit[]> {
    await new Promise((r) => setTimeout(r, 50));
    if (listingId)
      return mockStore.pgVisits.filter((v) => v.listingId === listingId);
    return [...mockStore.pgVisits];
  },

  async updateVisitStatus(
    visitId: string,
    status: PGVisit["status"],
    notes?: string,
  ): Promise<PGVisit> {
    await new Promise((r) => setTimeout(r, 80));
    const visit = mockStore.pgVisits.find((v) => v.id === visitId);
    if (!visit) throw new Error(`Visit ${visitId} not found`);

    visit.status = status;
    if (notes) visit.notes = notes;
    if (status === "COMPLETED") {
      visit.completedAt = new Date()
        .toISOString()
        .replace("T", " ")
        .slice(0, 16);
    }
    return { ...visit };
  },

  // Joinings & Commissions
  async getJoinings(listingId?: string): Promise<PGJoining[]> {
    await new Promise((r) => setTimeout(r, 50));
    if (listingId)
      return mockStore.pgJoinings.filter((j) => j.listingId === listingId);
    return [...mockStore.pgJoinings];
  },

  async confirmJoining(
    joiningData: Omit<PGJoining, "id" | "joinedAt" | "commissionAmount">,
    adminId = "ADM-001",
  ): Promise<{ joining: PGJoining; commission: PGCommissionRecord }> {
    await new Promise((r) => setTimeout(r, 120));
    const now = new Date().toISOString().replace("T", " ").slice(0, 16);

    const commissionAmount =
      joiningData.commissionType === "PERCENTAGE"
        ? Math.round(
            (joiningData.monthlyRent * joiningData.commissionRate) / 100,
          )
        : joiningData.commissionRate;

    const newJoining: PGJoining = {
      ...joiningData,
      id: `JOIN-${Date.now().toString().slice(-4)}`,
      commissionAmount,
      joinedAt: now,
      confirmedByAdmin: adminId,
    };
    mockStore.pgJoinings.unshift(newJoining);

    const gstAmount = Math.round(commissionAmount * 0.18);
    const newCommission: PGCommissionRecord = {
      id: `COMM-${Date.now().toString().slice(-4)}`,
      listingId: joiningData.listingId,
      propertyName: joiningData.propertyName,
      ownerPartnerId: joiningData.ownerPartnerId,
      ownerName: joiningData.ownerName,
      joiningId: newJoining.id,
      userName: joiningData.userName,
      monthlyRent: joiningData.monthlyRent,
      commissionType: joiningData.commissionType,
      commissionRate: joiningData.commissionRate,
      commissionAmount,
      gstAmount,
      totalReceivable: commissionAmount + gstAmount,
      status: "INVOICED",
      invoiceNumber: `INV-PG-${Date.now().toString().slice(-6)}`,
      createdAt: now,
    };
    mockStore.pgCommissions.unshift(newCommission);

    // Update listing available bed count
    const listing = mockStore.accommodations.find(
      (a) => a.id === joiningData.listingId,
    );
    if (listing && listing.availableBeds > 0) {
      listing.availableBeds -= 1;
      listing.joinsCount += 1;
    }

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "CONFIRM_PG_JOINING_AND_COMMISSION",
      entity: "PG_JOINING",
      entityId: newJoining.id,
      newValue: `Commission: ₹${commissionAmount}`,
      ipAddress: "127.0.0.1",
    });

    return { joining: newJoining, commission: newCommission };
  },

  async getCommissions(): Promise<PGCommissionRecord[]> {
    await new Promise((r) => setTimeout(r, 50));
    return [...mockStore.pgCommissions];
  },
};
