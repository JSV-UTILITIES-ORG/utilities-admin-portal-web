import { mockStore } from "./mockStore";
import type { Assignment, AssignmentStatus } from "../types/booking";
import type { Partner } from "../types/partner";
import { bookingService } from "./bookingService";

export const assignmentService = {
  async getAssignments(
    status?: AssignmentStatus | "ALL",
  ): Promise<Assignment[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!status || status === "ALL") {
      return [...mockStore.assignments];
    }
    return mockStore.assignments.filter((a) => a.status === status);
  },

  async getSuitablePartners(
    serviceCategoryOrName: string,
    city: string,
  ): Promise<Partner[]> {
    await new Promise((r) => setTimeout(r, 100));
    return mockStore.partners.filter(
      (p) =>
        p.status === "ACTIVE" &&
        (p.city.toLowerCase() === city.toLowerCase() || city === "ALL") &&
        (p.services.some((s) =>
          s.toLowerCase().includes(serviceCategoryOrName.toLowerCase()),
        ) ||
          p.serviceCategories.some((c) =>
            c.toLowerCase().includes(serviceCategoryOrName.toLowerCase()),
          ) ||
          true), // Fallback to all active partners in matching city
    );
  },

  async manualAssign(
    assignmentId: string,
    bookingId: string,
    partnerId: string,
    partnerName: string,
    adminName: string,
  ): Promise<void> {
    await bookingService.assignPartner(
      bookingId,
      partnerId,
      adminName,
    );
    const asg = mockStore.assignments.find(
      (a) => a.id === assignmentId || a.bookingId === bookingId,
    );
    if (asg) {
      asg.status = "ASSIGNED";
      asg.partnerId = partnerId;
      asg.partnerName = partnerName;
    }
  },
};
