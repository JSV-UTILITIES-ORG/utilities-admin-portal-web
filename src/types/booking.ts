export type BookingStatus =
  | "CREATED"
  | "AWAITING_ASSIGNMENT"
  | "ASSIGNED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PAYMENT_COMPLETED"
  | "ASSIGNMENT_FAILED"
  | "CANCELLED"
  | "PAYMENT_FAILED"
  | "DISPUTED";

export type AssignmentStatus =
  "UNASSIGNED" | "ASSIGNED" | "ACCEPTED" | "REJECTED" | "FAILED" | "REASSIGNED";

export interface BookingTimelineEvent {
  id: string;
  event: string;
  actor: string;
  actorType: "SYSTEM" | "ADMIN" | "PARTNER" | "CUSTOMER";
  timestamp: string;
  note?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  partnerId?: string;
  partnerName?: string;
  status: BookingStatus;
  assignmentStatus: AssignmentStatus;
  paymentStatus: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED";
  amount: number;
  address: string;
  city: string;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  timeline: BookingTimelineEvent[];
  notes?: string;
  waitingMinutes?: number;
}

export interface Assignment {
  id: string;
  bookingId: string;
  bookingService: string;
  customerId: string;
  customerName: string;
  customerCity: string;
  partnerId?: string;
  partnerName?: string;
  status: AssignmentStatus;
  waitingMinutes: number;
  slaMinutes: number;
  availablePartners: number;
  createdAt: string;
  failureReason?: string;
}
