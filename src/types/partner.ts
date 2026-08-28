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

export interface PartnerCapabilities {
  findWork: boolean;
  createJobs: boolean;
  hostAccommodation: boolean;
}

export interface PartnerDocument {
  id: string;
  type:
    | "AADHAAR"
    | "PAN"
    | "LICENSE"
    | "CERTIFICATE"
    | "PHOTO"
    | "BANK_PASSBOOK"
    | "PROPERTY_PROOF"
    | "GSTIN"
    | "OTHER";
  name: string;
  url: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  uploadedAt: string;
  metadata?: {
    idNumberMasked?: string;
    verifiedName?: string;
    score?: number;
    provider?: string;
  };
}

export interface RealtimeVerificationSummary {
  aadhaarVerified: boolean;
  aadhaarMatchScore?: number;
  panVerified: boolean;
  panMatchScore?: number;
  bankVerified: boolean;
  bankBeneficiaryName?: string;
  faceMatchScore?: number;
  overallConfidence: "HIGH" | "MEDIUM" | "LOW";
  verifiedAt?: string;
}

export interface Partner {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  status: PartnerStatus;
  verificationStatus: VerificationStatus;
  capabilities?: PartnerCapabilities;
  services: string[];
  serviceCategories: string[];
  city: string;
  address: string;
  serviceRadiusKm?: number;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  totalEarnings: number;
  pendingPayout: number;
  documents: PartnerDocument[];
  realtimeVerification?: RealtimeVerificationSummary;
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
  capabilities?: PartnerCapabilities;
  services: string[];
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  assignedTo?: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  documents: PartnerDocument[];
  realtimeVerification?: RealtimeVerificationSummary;
  notes?: string;
  ageInHours: number;
  slaHours: number;
}
