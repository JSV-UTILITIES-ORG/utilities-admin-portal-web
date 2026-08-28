export type BookingStatus =
  | "CREATED"
  | "AWAITING_ASSIGNMENT"
  | "ASSIGNED"
  | "ACCEPTED"
  | "TRAVELLING"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "ADDITIONAL_CHARGE_PENDING"
  | "COMPLETED"
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "PAID"
  | "ASSIGNMENT_FAILED"
  | "CANCELLED"
  | "PAYMENT_FAILED"
  | "DISPUTED"
  | "REFUND_REQUESTED"
  | "CLOSED";

export type AssignmentStatus =
  | "UNASSIGNED"
  | "ASSIGNED"
  | "ACCEPTED"
  | "REJECTED"
  | "FAILED"
  | "REASSIGNED";

export interface BookingTimelineEvent {
  id: string;
  event: string;
  actor: string;
  actorType: "SYSTEM" | "ADMIN" | "PARTNER" | "CUSTOMER";
  timestamp: string;
  note?: string;
}

export interface AdditionalCharge {
  id?: string;
  amount: number;
  reason: string;
  description?: string;
  photos?: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ServiceEvidencePhoto {
  id: string;
  url: string;
  type: "BEFORE" | "AFTER" | "ADDITIONAL_CHARGE";
  caption?: string;
  uploadedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  packageId?: string;
  packageName?: string;
  partnerId?: string;
  partnerName?: string;
  status: BookingStatus;
  assignmentStatus: AssignmentStatus;
  paymentStatus: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED";
  amount: number;
  baseAmount?: number;
  additionalChargesTotal?: number;
  additionalCharge?: AdditionalCharge;
  beforePhotos?: ServiceEvidencePhoto[];
  afterPhotos?: ServiceEvidencePhoto[];
  workNotes?: string;
  materialsUsed?: string[];
  address: string;
  city: string;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
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
