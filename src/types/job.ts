export type JobStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "PUBLISHED"
  | "SUSPENDED"
  | "CLOSED"
  | "REJECTED";

export type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "SELECTED"
  | "ASSIGNED"
  | "REJECTED"
  | "WITHDRAWN";

export interface JobPost {
  id: string;
  creatorPartnerId: string;
  creatorPartnerName: string;
  creatorPartnerMobile: string;
  creatorCompanyName?: string;
  title: string;
  description: string;
  requiredSkills: string[];
  workerCount: number;
  filledWorkerCount: number;
  location: string;
  city: string;
  startDate: string;
  endDate: string;
  dailyPay: number;
  workingHours: string;
  experienceYears: number;
  additionalRequirements?: string;
  attachments?: string[];
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  applicationsCount: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantPartnerId: string;
  applicantName: string;
  applicantMobile: string;
  applicantRating: number;
  applicantCompletedJobs: number;
  skills: string[];
  experienceYears: number;
  distanceKm: number;
  coverNote?: string;
  status: ApplicationStatus;
  appliedAt: string;
  shortlistedAt?: string;
  selectedAt?: string;
  assignedAt?: string;
  adminApprovedAt?: string;
  rejectionReason?: string;
}
