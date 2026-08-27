export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";
export type RefundStatus =
  "REQUESTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "PROCESSED";
export type SettlementStatus =
  "PENDING" | "PROCESSING" | "SETTLED" | "ON_HOLD" | "FAILED";

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: "UPI" | "CARD" | "NETBANKING" | "WALLET" | "COD";
  status: PaymentStatus;
  reference?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface Settlement {
  id: string;
  partnerId: string;
  partnerName: string;
  completedJobs: number;
  grossAmount: number;
  commission: number;
  partnerAmount: number;
  status: SettlementStatus;
  settlementDate?: string;
  createdAt: string;
}
