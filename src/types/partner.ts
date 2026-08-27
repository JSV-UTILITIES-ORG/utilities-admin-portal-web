export type PartnerStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "VERIFICATION_PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "REJECTED"
  | "SUSPENDED"
  | "INACTIVE";

export type VerificationStatus =
  "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "MORE_INFO_REQUIRED";

export interface PartnerDocument {
  id: string;
  type: "AADHAAR" | "PAN" | "LICENSE" | "CERTIFICATE" | "PHOTO" | "OTHER";
  name: string;
  url: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  uploadedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  status: PartnerStatus;
  verificationStatus: VerificationStatus;
  services: string[];
  serviceCategories: string[];
  city: string;
  address: string;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  totalEarnings: number;
  pendingPayout: number;
  documents: PartnerDocument[];
  joinedAt: string;
  lastActive: string;
  assignedAdmin?: string;
  rejectionReason?: string;
}

export interface Verification {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerMobile: string;
  services: string[];
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  assignedTo?: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  documents: PartnerDocument[];
  notes?: string;
  ageInHours: number;
  slaHours: number;
}
