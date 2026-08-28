import { mockStore } from "./mockStore";
import type {
  Booking,
  BookingStatus,
  AssignmentStatus,
  BookingTimelineEvent,
} from "../types/booking";

export interface BookingFilters {
  search?: string;
  status?: BookingStatus | "ALL";
  assignmentStatus?: AssignmentStatus | "ALL";
  serviceCategory?: string;
  city?: string;
}

export const bookingService = {
  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    await new Promise((r) => setTimeout(r, 80));
    let list = [...mockStore.bookings];

    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((b) => b.status === filters.status);
    }
    if (filters?.assignmentStatus && filters.assignmentStatus !== "ALL") {
      list = list.filter(
        (b) => b.assignmentStatus === filters.assignmentStatus,
      );
    }
    if (filters?.serviceCategory && filters.serviceCategory !== "ALL") {
      list = list.filter((b) => b.categoryName === filters.serviceCategory);
    }
    if (filters?.city && filters.city !== "ALL") {
      list = list.filter((b) => b.city === filters.city);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.customerName.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.partnerName?.toLowerCase().includes(q) ||
          b.customerMobile.includes(q),
      );
    }

    return list;
  },

  async getBookingById(id: string): Promise<Booking | null> {
    await new Promise((r) => setTimeout(r, 60));
    const booking = mockStore.bookings.find((b) => b.id === id);
    return booking ? { ...booking } : null;
  },

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    note?: string,
    adminId = "ADM-001",
  ): Promise<Booking> {
    await new Promise((r) => setTimeout(r, 100));
    const booking = mockStore.bookings.find((b) => b.id === id);
    if (!booking) throw new Error(`Booking ${id} not found`);

    booking.status = status;
    booking.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    if (status === "IN_PROGRESS" && !booking.startedAt) {
      booking.startedAt = booking.updatedAt;
    }
    if (status === "COMPLETED" && !booking.completedAt) {
      booking.completedAt = booking.updatedAt;
    }

    const event: BookingTimelineEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      event: `Status updated to ${status}`,
      actor: "Super Admin",
      actorType: "ADMIN",
      timestamp: booking.updatedAt,
      note: note || `Admin updated booking status to ${status}`,
    };
    booking.timeline.push(event);

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "UPDATE_BOOKING_STATUS",
      entity: "BOOKING",
      entityId: id,
      newValue: status,
      reason: note,
      ipAddress: "127.0.0.1",
    });

    return { ...booking };
  },

  async approveAdditionalCharge(
    bookingId: string,
    adminId = "ADM-001",
  ): Promise<Booking> {
    await new Promise((r) => setTimeout(r, 100));
    const booking = mockStore.bookings.find((b) => b.id === bookingId);
    if (!booking || !booking.additionalCharge) {
      throw new Error(`No pending additional charge for booking ${bookingId}`);
    }

    const now = new Date().toISOString().replace("T", " ").slice(0, 16);
    booking.additionalCharge.status = "APPROVED";
    booking.additionalCharge.reviewedAt = now;
    booking.additionalCharge.reviewedBy = adminId;

    // Recalculate total amount
    const addAmt = booking.additionalCharge.amount;
    booking.baseAmount = booking.baseAmount || booking.amount;
    booking.additionalChargesTotal =
      (booking.additionalChargesTotal || 0) + addAmt;
    booking.amount = booking.baseAmount + booking.additionalChargesTotal;
    booking.status = "IN_PROGRESS";

    booking.timeline.push({
      id: `EVT-${Date.now().toString().slice(-4)}`,
      event: `Additional Charge of ₹${addAmt} Approved`,
      actor: "Super Admin",
      actorType: "ADMIN",
      timestamp: now,
      note: `Reason: ${booking.additionalCharge.reason}. New total: ₹${booking.amount}`,
    });

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "APPROVE_ADDITIONAL_CHARGE",
      entity: "BOOKING",
      entityId: bookingId,
      newValue: `+₹${addAmt} (Total: ₹${booking.amount})`,
      ipAddress: "127.0.0.1",
    });

    return { ...booking };
  },

  async rejectAdditionalCharge(
    bookingId: string,
    adminId = "ADM-001",
  ): Promise<Booking> {
    await new Promise((r) => setTimeout(r, 100));
    const booking = mockStore.bookings.find((b) => b.id === bookingId);
    if (!booking || !booking.additionalCharge) {
      throw new Error(`No pending additional charge for booking ${bookingId}`);
    }

    const now = new Date().toISOString().replace("T", " ").slice(0, 16);
    booking.additionalCharge.status = "REJECTED";
    booking.additionalCharge.reviewedAt = now;
    booking.additionalCharge.reviewedBy = adminId;
    booking.status = "IN_PROGRESS";

    booking.timeline.push({
      id: `EVT-${Date.now().toString().slice(-4)}`,
      event: `Additional Charge Rejected`,
      actor: "Super Admin",
      actorType: "ADMIN",
      timestamp: now,
      note: "Additional charge request rejected. Original service amount remains unchanged.",
    });

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "REJECT_ADDITIONAL_CHARGE",
      entity: "BOOKING",
      entityId: bookingId,
      newValue: "REJECTED",
      ipAddress: "127.0.0.1",
    });

    return { ...booking };
  },

  async assignPartner(
    bookingId: string,
    partnerId: string,
    adminId = "ADM-001",
  ): Promise<Booking> {
    await new Promise((r) => setTimeout(r, 100));
    const booking = mockStore.bookings.find((b) => b.id === bookingId);
    const partner = mockStore.partners.find((p) => p.id === partnerId);
    if (!booking) throw new Error(`Booking ${bookingId} not found`);
    if (!partner) throw new Error(`Partner ${partnerId} not found`);

    const now = new Date().toISOString().replace("T", " ").slice(0, 16);
    booking.partnerId = partner.id;
    booking.partnerName = partner.name;
    booking.assignmentStatus = "ASSIGNED";
    booking.status = "ASSIGNED";
    booking.updatedAt = now;

    // Update assignment queue item
    const asgn = mockStore.assignments.find((a) => a.bookingId === bookingId);
    if (asgn) {
      asgn.status = "ASSIGNED";
      asgn.partnerId = partner.id;
      asgn.partnerName = partner.name;
    }

    booking.timeline.push({
      id: `EVT-${Date.now().toString().slice(-4)}`,
      event: `Assigned to Partner ${partner.name}`,
      actor: "Super Admin",
      actorType: "ADMIN",
      timestamp: now,
      note: `Admin assigned partner ${partner.name} (${partner.mobile})`,
    });

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "ASSIGN_PARTNER_TO_BOOKING",
      entity: "BOOKING",
      entityId: bookingId,
      newValue: `Partner: ${partner.name} (${partner.id})`,
      ipAddress: "127.0.0.1",
    });

    return { ...booking };
  },
};
