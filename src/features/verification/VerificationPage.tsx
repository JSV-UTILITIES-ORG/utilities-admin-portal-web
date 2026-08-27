import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verificationService } from "../../services/verificationService";
import type { Verification, VerificationStatus } from "../../types/partner";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { FilterBar, type FilterGroup } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SLAIndicator } from "../../components/ui/SLAIndicator";
import { Modal } from "../../components/ui/Modal";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { useAuth } from "../auth/AuthContext";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  HelpCircle,
} from "lucide-react";

export const VerificationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { admin } = useAuth();

  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusParam = searchParams.get("status") || "ALL";

  const [selectedVerif, setSelectedVerif] = useState<Verification | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isInfoReqOpen, setIsInfoReqOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await verificationService.getVerifications(
        statusParam as VerificationStatus | "ALL",
      );
      setVerifications(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val === "ALL" || !val) next.delete(key);
    else next.set(key, val);
    setSearchParams(next);
  };

  const handleApprove = async () => {
    if (!selectedVerif) return;
    await verificationService.approveVerification(
      selectedVerif.id,
      admin?.name || "Admin",
    );
    setIsReviewOpen(false);
    setActionSuccess(
      `Partner ${selectedVerif.partnerName} approved & activated!`,
    );
    loadData();
  };

  const handleReject = async (reason: string) => {
    if (!selectedVerif) return;
    await verificationService.rejectVerification(
      selectedVerif.id,
      reason,
      admin?.name || "Admin",
    );
    setIsReviewOpen(false);
    setActionSuccess(`Partner verification rejected.`);
    loadData();
  };

  const handleRequestInfo = async (reason: string) => {
    if (!selectedVerif) return;
    await verificationService.requestMoreInfo(
      selectedVerif.id,
      reason,
      admin?.name || "Admin",
    );
    setIsReviewOpen(false);
    setActionSuccess(`Clarification requested from partner.`);
    loadData();
  };

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Review Status",
      value: statusParam,
      options: [
        { label: "All Verifications", value: "ALL" },
        { label: "Pending Review", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
        { label: "More Info Required", value: "MORE_INFO_REQUIRED" },
      ],
      onChange: (v) => updateParam("status", v),
    },
  ];

  const columns: Column<Verification>[] = [
    {
      header: "Partner Name",
      accessor: (v) => (
        <div>
          <p className="font-bold text-slate-900">{v.partnerName}</p>
          <p className="text-[11px] text-slate-400 font-mono">
            ID: {v.partnerId}
          </p>
        </div>
      ),
    },
    {
      header: "Services Offered",
      accessor: (v) => (
        <span className="font-semibold text-slate-800">
          {v.services.join(", ")}
        </span>
      ),
    },
    {
      header: "Documents",
      accessor: (v) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>{v.documents.length} files</span>
        </div>
      ),
    },
    {
      header: "Review SLA",
      accessor: (v) => (
        <SLAIndicator
          elapsedHours={v.ageInHours}
          limitHours={v.slaHours || 24}
          isBreached={v.ageInHours > (v.slaHours || 24)}
        />
      ),
    },
    {
      header: "Status",
      accessor: (v) => <StatusBadge status={v.status} />,
    },
    {
      header: "Action",
      accessor: (v) => (
        <button
          type="button"
          onClick={() => {
            setSelectedVerif(v);
            setIsReviewOpen(true);
          }}
          className="px-3 py-1 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all"
        >
          Review KYC
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Partner Verification Queue (KYC)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review identity proofs, background checks and trade certificates
            with 24h SLA tracking
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="flex items-center justify-between bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs">
        <FilterBar
          groups={filterGroups}
          onReset={() => setSearchParams(new URLSearchParams())}
        />
      </div>

      <DataTable
        columns={columns}
        data={verifications}
        keyExtractor={(v) => v.id}
        isLoading={isLoading}
        onRowClick={(v) => {
          setSelectedVerif(v);
          setIsReviewOpen(true);
        }}
      />

      {selectedVerif && (
        <Modal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          title={`KYC Review — ${selectedVerif.partnerName}`}
          subtitle={`Submitted on ${selectedVerif.submittedAt} • SLA Age: ${selectedVerif.ageInHours}h`}
          maxWidth="xl"
        >
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Submitted Documents & Proofs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedVerif.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {doc.type}
                        </p>
                      </div>
                      <StatusBadge
                        status={doc.status}
                        className="text-[10px]"
                      />
                    </div>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Inspect Document →</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsInfoReqOpen(true)}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 transition-colors flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Request Clarification</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectOpen(true)}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject KYC</span>
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Activate Partner</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmationDialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
        title={`Reject KYC for ${selectedVerif?.partnerName}`}
        message="Please provide a specific rejection reason so the partner can rectify their submission."
        requireReason={true}
        reasonPlaceholder="Specify reason (e.g. Blurry photo, expired certificate)..."
        confirmLabel="Reject Submission"
        isDestructive={true}
      />

      <ConfirmationDialog
        isOpen={isInfoReqOpen}
        onClose={() => setIsInfoReqOpen(false)}
        onConfirm={handleRequestInfo}
        title={`Request Clarification from ${selectedVerif?.partnerName}`}
        message="Send a notification to the partner requesting specific additional documentation."
        requireReason={true}
        reasonPlaceholder="Specify what additional documents or clarification are needed..."
        confirmLabel="Send Request"
      />
    </div>
  );
};
