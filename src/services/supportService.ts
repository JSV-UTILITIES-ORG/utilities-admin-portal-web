import { mockStore } from "./mockStore";
import type { SupportTicket, TicketStatus } from "../types/support";

export const supportService = {
  async getTickets(
    filterSlaBreached?: boolean,
    status?: TicketStatus | "ALL",
  ): Promise<SupportTicket[]> {
    await new Promise((r) => setTimeout(r, 100));
    let list = [...mockStore.tickets];
    if (filterSlaBreached) {
      list = list.filter((t) => t.slaBreached);
    }
    if (status && status !== "ALL") {
      list = list.filter((t) => t.status === status);
    }
    return list;
  },

  async getTicketById(id: string): Promise<SupportTicket | null> {
    await new Promise((r) => setTimeout(r, 100));
    return mockStore.tickets.find((t) => t.id === id) || null;
  },

  async resolveTicket(
    id: string,
    resolutionNote: string,
    adminName: string,
  ): Promise<SupportTicket> {
    await new Promise((r) => setTimeout(r, 150));
    const ticket = mockStore.tickets.find((t) => t.id === id);
    if (!ticket) throw new Error("Ticket not found");

    ticket.status = "RESOLVED";
    ticket.resolvedAt = new Date().toISOString().replace("T", " ").slice(0, 16);
    ticket.updatedAt = ticket.resolvedAt;

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "SUPPORT_TICKET_RESOLVED",
      entity: "SupportTicket",
      entityId: id,
      previousValue: "OPEN",
      newValue: "RESOLVED",
      reason: resolutionNote,
      ipAddress: "127.0.0.1",
    });

    return { ...ticket };
  },
};
