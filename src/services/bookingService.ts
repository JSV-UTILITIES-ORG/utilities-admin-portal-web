import { mockStore } from "./mockStore";
import type {
  Booking,
  BookingStatus,
  AssignmentStatus,
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
    await new Promise((r) => setTimeout(r, 100));
    let list = [...mockStore.bookings];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q) ||
          (b.partnerName && b.partnerName.toLowerCase().includes(q)),
      );
    }

    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((b) => b.status === filters.status);
    }

    if (filters?.assignmentStatus && filters.assignmentStatus !== "ALL") {
      list = list.filter(
        (b) => b.assignmentStatus === filters.assignmentStatus,
      );
    }

    if (filters?.city && filters.city !== "ALL") {
      list = list.filter((b) => b.city === filters.city);
    }

    return list;
  },

  async getBookingById(id: string): Promise<Booking | null> {
    await new Promise((r) => setTimeout(r, 100));
    return mockStore.bookings.find((b) => b.id === id) || null;
  },

  async assignPartner(
    bookingId: string,
    partnerId: string,
    partnerName: string,
    adminName: string,
  ): Promise<Booking> {
    await new Promise((r) => setTimeout(r, 150));
    const booking = mockStore.bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    const prevStatus = booking.status;
    booking.partnerId = partnerId;
    booking.partnerName = partnerName;
    booking.status = "ASSIGNED";
    booking.assignmentStatus = "ASSIGNED";
    booking.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    booking.timeline.push({
      id: `TL-${Date.now()}`,
      event: `Assigned to ${partnerName} manually`,
      actor: adminName,
      actorType: "ADMIN",
      timestamp: booking.updatedAt,
    });

    // Remove from failed assignments
    const asgIndex = mockStore.assignments.findIndex(
      (a) => a.bookingId === bookingId,
    );
    if (asgIndex >= 0) {
      mockStore.assignments[asgIndex].status = "ASSIGNED";
      mockStore.assignments[asgIndex].partnerId = partnerId;
      mockStore.assignments[asgIndex].partnerName = partnerName;
    }

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "BOOKING_ASSIGNED",
      entity: "Booking",
      entityId: bookingId,
      previousValue: prevStatus,
      newValue: `ASSIGNED to ${partnerName}`,
      reason: "Manual admin dispatch",
      ipAddress: "127.0.0.1",
    });

    return { ...booking };
  },

  async cancelBooking(
    bookingId: string,
    reason: string,
    adminName: string,
  ): Promise<Booking> {
    await new Promise((r) => setTimeout(r, 150));
    const booking = mockStore.bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    booking.status = "CANCELLED";
    booking.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    booking.timeline.push({
      id: `TL-${Date.now()}`,
      event: `Booking cancelled by Admin. Reason: ${reason}`,
      actor: adminName,
      actorType: "ADMIN",
      timestamp: booking.updatedAt,
    });

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "BOOKING_CANCELLED",
      entity: "Booking",
      entityId: bookingId,
      newValue: "CANCELLED",
      reason,
      ipAddress: "127.0.0.1",
    });

    return { ...booking };
  },
};
