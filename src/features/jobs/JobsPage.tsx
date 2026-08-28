import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jobService } from "../../services/jobService";
import type { JobPost, JobStatus } from "../../types/job";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { MetricCard } from "../../components/ui/MetricCard";
import { Modal } from "../../components/ui/Modal";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { useAuth } from "../auth/AuthContext";
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Eye,
  Check,
  X,
  Building,
  Search,
} from "lucide-react";

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { admin } = useAuth();

  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "ALL",
  );
  const [cityFilter, setCityFilter] = useState<string>("ALL");

  // Moderation state
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await jobService.getJobs({
        search: search || undefined,
        status:
          statusFilter === "ALL" ? undefined : (statusFilter as JobStatus),
        city: cityFilter === "ALL" ? undefined : cityFilter,
      });
      setJobs(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, cityFilter]);

  const handleApprove = async () => {
    if (!selectedJob) return;
    try {
      await jobService.approveJob(selectedJob.id, admin?.id);
      setActionSuccess(
        `Job Post "${selectedJob.title}" has been approved and published!`,
      );
      setIsApproveOpen(false);
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to approve job");
    }
  };

  const handleReject = async () => {
    if (!selectedJob || !rejectReason.trim()) return;
    try {
      await jobService.rejectJob(selectedJob.id, rejectReason, admin?.id);
      setActionSuccess(`Job Post "${selectedJob.title}" has been rejected.`);
      setIsRejectOpen(false);
      setRejectReason("");
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to reject job");
    }
  };

  // Metrics
  const totalJobs = jobs.length;
  const pendingApprovals = jobs.filter((j) => j.status === "SUBMITTED").length;
  const publishedJobs = jobs.filter((j) => j.status === "PUBLISHED").length;
  const totalWorkersNeeded = jobs.reduce((acc, j) => acc + j.workerCount, 0);
  const totalWorkersFilled = jobs.reduce(
    (acc, j) => acc + j.filledWorkerCount,
    0,
  );

  const cityOptions = [
    { label: "All Cities", value: "ALL" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Bangalore", value: "Bangalore" },
  ];

  const columns: Column<JobPost>[] = [
    {
      header: "Job Title & Identifier",
      className: "min-w-[260px]",
      accessor: (j) => (
        <div className="py-0.5">
          <button
            onClick={() => navigate(`/jobs/${j.id}`)}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left text-xs block leading-snug"
          >
            {j.title}
          </button>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 whitespace-nowrap">
            <span className="inline-block whitespace-nowrap bg-slate-100/90 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200/60">
              {j.id}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <Building className="w-3 h-3 text-slate-400" />
              {j.creatorCompanyName || j.creatorPartnerName}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Location & City",
      className: "min-w-[160px]",
      accessor: (j) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-800 whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{j.city}</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate max-w-[180px] mt-0.5">
            {j.location}
          </p>
        </div>
      ),
    },
    {
      header: "Worker Slots",
      className: "whitespace-nowrap min-w-[150px]",
      accessor: (j) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {j.filledWorkerCount} / {j.workerCount} Filled
            </span>
          </div>
          <div className="w-28 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (j.filledWorkerCount / (j.workerCount || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Daily Pay",
      className: "whitespace-nowrap min-w-[120px]",
      accessor: (j) => (
        <div className="text-xs font-extrabold text-slate-900">
          ₹{j.dailyPay.toLocaleString()}{" "}
          <span className="text-[10px] text-slate-400 font-normal">/ day</span>
        </div>
      ),
    },
    {
      header: "Duration",
      className: "whitespace-nowrap min-w-[140px]",
      accessor: (j) => (
        <div className="text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{j.startDate}</span>
          </div>
          <div className="text-slate-400 text-[10px] pl-5 font-medium">
            to {j.endDate}
          </div>
        </div>
      ),
    },
    {
      header: "Applications",
      className: "whitespace-nowrap min-w-[120px]",
      accessor: (j) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-2xs">
          {j.applicationsCount} Applicants
        </span>
      ),
    },
    {
      header: "Status",
      className: "whitespace-nowrap min-w-[120px]",
      accessor: (j) => <StatusBadge status={j.status} />,
    },
    {
      header: "Actions",
      className: "whitespace-nowrap text-right min-w-[100px]",
      accessor: (j) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => navigate(`/jobs/${j.id}`)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all border border-slate-200/60 bg-white shadow-2xs"
            title="View Details & Applicants"
          >
            <Eye className="w-4 h-4" />
          </button>
          {j.status === "SUBMITTED" && (
            <>
              <button
                onClick={() => {
                  setSelectedJob(j);
                  setIsApproveOpen(true);
                }}
                className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-200/80 bg-emerald-50 shadow-2xs"
                title="Approve & Publish"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedJob(j);
                  setIsRejectOpen(true);
                }}
                className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-xl transition-all border border-rose-200/80 bg-rose-50 shadow-2xs"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <span>Work Marketplace (Partner-Created Jobs)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Admin moderation, workforce requirements, candidate shortlisting,
            and locked worker assignments.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2.5 animate-fadeIn shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Job Posts"
          value={totalJobs}
          subtitle="+2 this week"
          icon={<Briefcase className="w-4 h-4 text-slate-600" />}
        />
        <MetricCard
          title="Pending Moderation"
          value={pendingApprovals}
          subtitle="Needs review"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
        />
        <MetricCard
          title="Published & Active"
          value={publishedJobs}
          subtitle="Available for partners"
          icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
        />
        <MetricCard
          title="Workforce Filled"
          value={`${totalWorkersFilled} / ${totalWorkersNeeded}`}
          subtitle={`${Math.round((totalWorkersFilled / (totalWorkersNeeded || 1)) * 100)}% Fill rate`}
          icon={<Users className="w-4 h-4 text-indigo-600" />}
        />
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100/80 rounded-xl">
          {[
            { label: "All Jobs", value: "ALL" },
            { label: "Pending Review", value: "SUBMITTED" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Closed / Filled", value: "CLOSED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setSearchParams({ status: tab.value });
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.value
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search job title, partner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            />
          </div>
          <div className="w-40 shrink-0">
            <CustomSelect
              options={cityOptions}
              value={cityFilter}
              onChange={(val) => setCityFilter(val)}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={jobs}
        columns={columns}
        keyExtractor={(j) => j.id}
        isLoading={isLoading}
        emptyMessage="No partner job posts found for this filter."
      />

      {/* Approve Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve & Publish Job Post"
        message={`Are you sure you want to approve "${selectedJob?.title}"? It will be published immediately to all eligible partners under 'Find Work'.`}
        confirmLabel="Approve & Publish"
        isDestructive={false}
      />

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject Job Post"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Provide a clear operational reason for rejecting this job post. The
            partner will be notified to revise their submission.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Compensation below platform minimum rate..."
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsRejectOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-50 shadow-xs transition-colors"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
