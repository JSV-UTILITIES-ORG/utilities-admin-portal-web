import { mockStore } from "./mockStore";
import type {
  JobPost,
  JobApplication,
  JobStatus,
  ApplicationStatus,
} from "../types/job";

export interface JobFilters {
  search?: string;
  status?: JobStatus | "ALL";
  city?: string;
  skill?: string;
}

export const jobService = {
  async getJobs(filters?: JobFilters): Promise<JobPost[]> {
    await new Promise((r) => setTimeout(r, 80));
    let list = [...mockStore.jobs];

    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((j) => j.status === filters.status);
    }
    if (filters?.city && filters.city !== "ALL") {
      list = list.filter(
        (j) => j.city.toLowerCase() === filters.city?.toLowerCase(),
      );
    }
    if (filters?.skill && filters.skill !== "ALL") {
      list = list.filter((j) =>
        j.requiredSkills.some((s) =>
          s.toLowerCase().includes(filters.skill!.toLowerCase()),
        ),
      );
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.creatorPartnerName.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.id.toLowerCase().includes(q),
      );
    }
    return list;
  },

  async getJobById(id: string): Promise<JobPost | null> {
    await new Promise((r) => setTimeout(r, 50));
    const job = mockStore.jobs.find((j) => j.id === id);
    return job ? { ...job } : null;
  },

  async getJobApplications(jobId?: string): Promise<JobApplication[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (jobId) {
      return mockStore.jobApplications.filter((a) => a.jobId === jobId);
    }
    return [...mockStore.jobApplications];
  },

  async approveJob(jobId: string, adminId = "ADM-001"): Promise<JobPost> {
    await new Promise((r) => setTimeout(r, 100));
    const job = mockStore.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    job.status = "PUBLISHED";
    job.reviewedBy = adminId;
    job.reviewedAt = new Date().toISOString().replace("T", " ").slice(0, 16);
    job.updatedAt = job.reviewedAt;

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "APPROVE_JOB_POST",
      entity: "JOB_POST",
      entityId: jobId,
      newValue: "PUBLISHED",
      ipAddress: "127.0.0.1",
    });

    return { ...job };
  },

  async rejectJob(
    jobId: string,
    reason: string,
    adminId = "ADM-001",
  ): Promise<JobPost> {
    await new Promise((r) => setTimeout(r, 100));
    const job = mockStore.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    job.status = "REJECTED";
    job.rejectionReason = reason;
    job.reviewedBy = adminId;
    job.reviewedAt = new Date().toISOString().replace("T", " ").slice(0, 16);
    job.updatedAt = job.reviewedAt;

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "REJECT_JOB_POST",
      entity: "JOB_POST",
      entityId: jobId,
      newValue: `REJECTED: ${reason}`,
      ipAddress: "127.0.0.1",
    });

    return { ...job };
  },

  async suspendJob(jobId: string, adminId = "ADM-001"): Promise<JobPost> {
    await new Promise((r) => setTimeout(r, 80));
    const job = mockStore.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    job.status = "SUSPENDED";
    job.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16);

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: "SUSPEND_JOB_POST",
      entity: "JOB_POST",
      entityId: jobId,
      newValue: "SUSPENDED",
      ipAddress: "127.0.0.1",
    });

    return { ...job };
  },

  async updateApplicationStatus(
    appId: string,
    newStatus: ApplicationStatus,
    adminId = "ADM-001",
  ): Promise<JobApplication> {
    await new Promise((r) => setTimeout(r, 100));
    const app = mockStore.jobApplications.find((a) => a.id === appId);
    if (!app) throw new Error(`Application ${appId} not found`);

    const now = new Date().toISOString().replace("T", " ").slice(0, 16);
    app.status = newStatus;

    if (newStatus === "SHORTLISTED") app.shortlistedAt = now;
    if (newStatus === "SELECTED") app.selectedAt = now;
    if (newStatus === "ASSIGNED") {
      app.assignedAt = now;
      app.adminApprovedAt = now;
      // Increment filled count on job
      const job = mockStore.jobs.find((j) => j.id === app.jobId);
      if (job && job.filledWorkerCount < job.workerCount) {
        job.filledWorkerCount += 1;
        if (job.filledWorkerCount >= job.workerCount) {
          job.status = "CLOSED";
        }
      }
    }

    mockStore.addAuditLog({
      adminId,
      adminName: "Super Admin",
      action: `UPDATE_APPLICATION_${newStatus}`,
      entity: "JOB_APPLICATION",
      entityId: appId,
      newValue: newStatus,
      ipAddress: "127.0.0.1",
    });

    return { ...app };
  },
};
