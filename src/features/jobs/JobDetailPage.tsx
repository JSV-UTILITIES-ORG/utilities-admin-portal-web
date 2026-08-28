import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../../services/jobService";
import type {
  JobPost,
  JobApplication,
  ApplicationStatus,
} from "../../types/job";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { useAuth } from "../auth/AuthContext";
import {
  ArrowLeft,
  Briefcase,
  Users,
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Building,
  Phone,
  XCircle,
  Lock,
} from "lucide-react";

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [job, setJob] = useState<JobPost | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [actionSuccess, setActionSuccess] = useState("");

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRejectAppOpen, setIsRejectAppOpen] = useState(false);

  const loadJobData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [jobData, appData] = await Promise.all([
        jobService.getJobById(id),
        jobService.getJobApplications(id),
      ]);
      setJob(jobData);
      setApplications(appData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAppStatusChange = async (newStatus: ApplicationStatus) => {
    if (!selectedApp) return;
    try {
      await jobService.updateApplicationStatus(
        selectedApp.id,
        newStatus,
        admin?.id,
      );
      setActionSuccess(
        `Applicant ${selectedApp.applicantName} marked as ${newStatus}!`,
      );
      setIsAssignModalOpen(false);
      setIsRejectAppOpen(false);
      loadJobData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Failed to update application",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800">Job Not Found</h2>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-3 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Work Marketplace</span>
        </button>
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Main Job Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px] text-slate-600 font-bold">
                {job.id}
              </span>
              <span>•</span>
              <span>Posted on {job.createdAt}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1.5">
              {job.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                {job.creatorCompanyName || job.creatorPartnerName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {job.creatorPartnerMobile}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Worker Slots
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {job.filledWorkerCount} / {job.workerCount} Filled
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Daily Compensation
              </div>
              <div className="text-base font-bold text-emerald-600 mt-0.5">
                ₹{job.dailyPay} / day
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
          {job.description}
        </p>

        {/* Job Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs">
            <div className="text-slate-400 flex items-center gap-1 font-medium text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Location</span>
            </div>
            <div className="font-bold text-slate-900 mt-1">{job.city}</div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5">
              {job.location}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs">
            <div className="text-slate-400 flex items-center gap-1 font-medium text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Duration</span>
            </div>
            <div className="font-bold text-slate-900 mt-1">{job.startDate}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              to {job.endDate}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs">
            <div className="text-slate-400 flex items-center gap-1 font-medium text-[11px]">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Working Hours</span>
            </div>
            <div className="font-bold text-slate-900 mt-1">
              {job.workingHours}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs">
            <div className="text-slate-400 flex items-center gap-1 font-medium text-[11px]">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Min. Experience</span>
            </div>
            <div className="font-bold text-slate-900 mt-1">
              {job.experienceYears} Years
            </div>
          </div>
        </div>

        {/* Required Skills Chips */}
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
            Required Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((s, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Received Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Job Applications Received ({applications.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review applicant partner credentials. Once a partner is assigned,
              their status is locked.
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-slate-100 text-xs text-slate-400">
            No partner has applied for this job yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => {
              const isAssigned = app.status === "ASSIGNED";
              const isShortlisted = app.status === "SHORTLISTED";
              const isApplied = app.status === "APPLIED";
              const isRejected = app.status === "REJECTED";

              return (
                <div
                  key={app.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAssigned
                      ? "bg-emerald-50/30 border-emerald-300"
                      : isShortlisted
                        ? "bg-blue-50/20 border-blue-200"
                        : isRejected
                          ? "bg-slate-50/50 border-slate-200 opacity-60"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>{app.applicantName}</span>
                        <span className="flex items-center gap-0.5 text-amber-600 text-[11px] font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {app.applicantRating}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{app.applicantMobile}</span>
                        <span>•</span>
                        <span>{app.applicantCompletedJobs} completed jobs</span>
                        <span>•</span>
                        <span>{app.distanceKm} km away</span>
                      </div>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </div>

                  {app.coverNote && (
                    <p className="text-[11px] text-slate-600 bg-slate-50/70 p-2.5 rounded-lg mt-2.5 border border-slate-100 italic">
                      "{app.coverNote}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {app.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Clean State-Specific Actions */}
                  <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                    {isApplied && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setIsRejectAppOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            handleAppStatusChange("SHORTLISTED");
                          }}
                          className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Shortlist Candidate
                        </button>
                      </>
                    )}

                    {isShortlisted && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setIsRejectAppOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setIsAssignModalOpen(true);
                          }}
                          className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Admin Approve & Assign</span>
                        </button>
                      </>
                    )}

                    {isAssigned && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Worker Slot Locked & Assigned</span>
                      </div>
                    )}

                    {isRejected && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Application Rejected</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Assign Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onConfirm={() => handleAppStatusChange("ASSIGNED")}
        title="Admin Confirm & Lock Worker Assignment"
        message={`Are you sure you want to approve and lock the assignment of ${selectedApp?.applicantName} for "${job.title}"? This fulfills 1 worker slot.`}
        confirmLabel="Confirm & Lock Assignment"
        isDestructive={false}
      />

      {/* Reject Application Dialog */}
      <ConfirmationDialog
        isOpen={isRejectAppOpen}
        onClose={() => setIsRejectAppOpen(false)}
        onConfirm={() => handleAppStatusChange("REJECTED")}
        title="Reject Job Candidate"
        message={`Reject candidate application from ${selectedApp?.applicantName}? They will be notified that their application was not selected.`}
        confirmLabel="Confirm Rejection"
        isDestructive={true}
      />
    </div>
  );
};
