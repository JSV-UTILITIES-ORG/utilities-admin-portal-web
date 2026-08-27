import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  partnerService,
  type PartnerFilters,
} from "../../services/partnerService";
import type {
  Partner,
  PartnerStatus,
  VerificationStatus,
} from "../../types/partner";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { SearchInput } from "../../components/ui/SearchInput";
import { FilterBar, type FilterGroup } from "../../components/ui/FilterBar";
import { Pagination } from "../../components/ui/Pagination";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Users, Eye, Star } from "lucide-react";

export const PartnersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusParam = searchParams.get("status") || "ALL";
  const verifParam = searchParams.get("verification") || "ALL";
  const cityParam = searchParams.get("city") || "ALL";
  const searchParam = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const filters: PartnerFilters = {
        search: searchParam,
        status: statusParam as PartnerStatus | "ALL",
        verificationStatus: verifParam as VerificationStatus | "ALL",
        city: cityParam,
      };
      const data = await partnerService.getPartners(filters);
      setPartners(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val === "ALL" || !val) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
    setCurrentPage(1);
  };

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Status",
      value: statusParam,
      options: [
        { label: "All Statuses", value: "ALL" },
        { label: "Active", value: "ACTIVE" },
        { label: "Pending", value: "PENDING" },
        { label: "Suspended", value: "SUSPENDED" },
        { label: "Inactive", value: "INACTIVE" },
      ],
      onChange: (v) => updateParam("status", v),
    },
    {
      id: "verification",
      label: "KYC Verification",
      value: verifParam,
      options: [
        { label: "All Verification", value: "ALL" },
        { label: "Verified", value: "VERIFIED" },
        { label: "Pending Review", value: "PENDING" },
        { label: "Under Review", value: "UNDER_REVIEW" },
        { label: "Rejected", value: "REJECTED" },
      ],
      onChange: (v) => updateParam("verification", v),
    },
    {
      id: "city",
      label: "City Zone",
      value: cityParam,
      options: [
        { label: "All Cities", value: "ALL" },
        { label: "Bengaluru", value: "Bengaluru" },
        { label: "Pune", value: "Pune" },
        { label: "Mumbai", value: "Mumbai" },
        { label: "Chennai", value: "Chennai" },
        { label: "Gurugram", value: "Gurugram" },
      ],
      onChange: (v) => updateParam("city", v),
    },
  ];

  const columns: Column<Partner>[] = [
    {
      header: "Partner Name",
      accessor: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-xs font-bold shrink-0">
            {p.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{p.name}</p>
            <p className="text-[11px] text-slate-400 font-mono">{p.mobile}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Category & Zone",
      accessor: (p) => (
        <div>
          <p className="font-semibold text-slate-900">
            {p.serviceCategories.join(", ") || p.services[0]}
          </p>
          <p className="text-[11px] text-slate-400">{p.city}</p>
        </div>
      ),
    },
    {
      header: "Account Status",
      accessor: (p) => <StatusBadge status={p.status} />,
    },
    {
      header: "KYC Document",
      accessor: (p) => <StatusBadge status={p.verificationStatus} />,
    },
    {
      header: "Performance",
      accessor: (p) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-900">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{p.rating || "New"}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {p.completedJobs} jobs done
          </p>
        </div>
      ),
    },
    {
      header: "Total Earnings",
      accessor: (p) => (
        <div>
          <span className="font-bold text-slate-900">
            ₹{p.totalEarnings.toLocaleString("en-IN")}
          </span>
          <p className="text-[11px] text-slate-400">
            Escrow: ₹{p.pendingPayout.toLocaleString("en-IN")}
          </p>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (p) => (
        <button
          type="button"
          onClick={() => navigate(`/partners/${p.id}`)}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>
      ),
    },
  ];

  const pagedPartners = partners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Service Partner Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage onboarding, ratings, document verification, and account
            status across all service zones
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs">
        <SearchInput
          value={searchParam}
          onChange={(v) => updateParam("search", v)}
          placeholder="Search partner name, mobile or skill..."
          className="w-full md:w-80"
        />

        <FilterBar
          groups={filterGroups}
          onReset={() => setSearchParams(new URLSearchParams())}
        />
      </div>

      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={pagedPartners}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          onRowClick={(p) => navigate(`/partners/${p.id}`)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(partners.length / pageSize)}
          totalItems={partners.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};
