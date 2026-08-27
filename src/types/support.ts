export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_CUSTOMER"
  | "RESOLVED"
  | "CLOSED"
  | "ESCALATED";
export type TicketCategory =
  | "BOOKING_ISSUE"
  | "PAYMENT_ISSUE"
  | "PARTNER_ISSUE"
  | "APP_ISSUE"
  | "REFUND"
  | "OTHER";

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  partnerId?: string;
  partnerName?: string;
  bookingId?: string;
  category: TicketCategory;
  subject: string;
  description: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: TicketStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaHours: number;
  ageInHours: number;
  slaBreached: boolean;
}
