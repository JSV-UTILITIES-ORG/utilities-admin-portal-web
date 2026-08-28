export type AccommodationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "PUBLISHED"
  | "SUSPENDED"
  | "REJECTED";

export type GenderAllowed = "MALE" | "FEMALE" | "CO_LIVING";

export type SharingType =
  | "SINGLE"
  | "DOUBLE_SHARING"
  | "TRIPLE_SHARING"
  | "FOUR_SHARING"
  | "DORMITORY";

export interface Bed {
  id: string;
  bedNumber: string;
  isOccupied: boolean;
  occupiedByUserName?: string;
  monthlyRent: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  sharingType: SharingType;
  totalBeds: number;
  availableBeds: number;
  rentPerBed: number;
  attachedBathroom: boolean;
  hasAc: boolean;
  beds: Bed[];
}

export interface VerificationChecklist {
  addressVerified: boolean;
  photosVerified: boolean;
  amenitiesVerified: boolean;
  inventoryVerified: boolean;
  ownerVerified: boolean;
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface AccommodationListing {
  id: string;
  ownerPartnerId: string;
  ownerName: string;
  ownerMobile: string;
  propertyName: string;
  address: string;
  city: string;
  area: string;
  pincode: string;
  genderAllowed: GenderAllowed;
  rooms: Room[];
  totalBeds: number;
  availableBeds: number;
  startingPriceMonthly: number;
  securityDeposit: number;
  amenities: string[];
  houseRules: string[];
  foodIncluded: boolean;
  photos: string[];
  videos?: string[];
  status: AccommodationStatus;
  verificationChecklist: VerificationChecklist;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  enquiriesCount: number;
  visitsCount: number;
  joinsCount: number;
}

export interface PGEnquiry {
  id: string;
  listingId: string;
  propertyName: string;
  userId: string;
  userName: string;
  userMobile: string;
  moveInDate: string;
  message?: string;
  status: "NEW" | "CONTACTED" | "VISIT_SCHEDULED" | "DROPPED" | "JOINED";
  createdAt: string;
}

export interface PGVisit {
  id: string;
  listingId: string;
  propertyName: string;
  userId: string;
  userName: string;
  userMobile: string;
  scheduledDate: string;
  timeSlot: string;
  status: "REQUESTED" | "CONFIRMED" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PGJoining {
  id: string;
  listingId: string;
  propertyName: string;
  ownerPartnerId: string;
  ownerName: string;
  userId: string;
  userName: string;
  userMobile: string;
  roomNumber: string;
  bedNumber: string;
  moveInDate: string;
  monthlyRent: number;
  securityDeposit: number;
  commissionType: "FIXED" | "PERCENTAGE";
  commissionRate: number;
  commissionAmount: number;
  commissionStatus: "PENDING" | "INVOICED" | "COLLECTED";
  joinedAt: string;
  confirmedByAdmin?: string;
}
