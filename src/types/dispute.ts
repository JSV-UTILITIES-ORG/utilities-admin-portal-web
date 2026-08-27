export type DisputeStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "WAITING_FOR_CUSTOMER"
  | "WAITING_FOR_PARTNER"
  | "RESOLVED"
  | "CLOSED"
  | "ESCALATED";

export type DisputeCategory =
  | "SERVICE_NOT_COMPLETED"
  | "POOR_QUALITY"
  | "INCORRECT_CHARGE"
  | "PAYMENT_DISPUTE"
  | "PARTNER_BEHAVIOUR"
  | "OTHER";

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  partnerId: string;
  partnerName: string;
  category: DisputeCategory;
  description: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: DisputeStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolution?: string;
  slaHours: number;
  ageInHours: number;
}
