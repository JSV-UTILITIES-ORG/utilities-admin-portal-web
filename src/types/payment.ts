export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type RefundStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSED";

export type SettlementStatus =
  | "PENDING"
  | "PROCESSING"
  | "SETTLED"
  | "ON_HOLD"
  | "FAILED";

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
  domain?: "SERVICE" | "PG_COMMISSION";
  completedJobs: number;
  grossAmount: number;
  commission: number;
  taxDeduction?: number;
  partnerAmount: number;
  status: SettlementStatus;
  settlementDate?: string;
  createdAt: string;
}

export interface PGCommissionRecord {
  id: string;
  listingId: string;
  propertyName: string;
  ownerPartnerId: string;
  ownerName: string;
  joiningId: string;
  userName: string;
  monthlyRent: number;
  commissionType: "FIXED" | "PERCENTAGE";
  commissionRate: number;
  commissionAmount: number;
  gstAmount: number;
  totalReceivable: number;
  status: "PENDING" | "INVOICED" | "COLLECTED";
  invoiceNumber?: string;
  createdAt: string;
  collectedAt?: string;
}
