import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { partnerService } from "../../services/partnerService";
import type { Partner, PartnerStatus } from "../../types/partner";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SearchInput } from "../../components/ui/SearchInput";
import { FilterBar } from "../../components/ui/FilterBar";
import { Pagination } from "../../components/ui/Pagination";
import { Eye, Users, Star, Phone, MapPin } from "lucide-react";

export const PartnersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const statusParam = (searchParams.get("status") as PartnerStatus) || "ALL";
  const cityParam = searchParams.get("city") || "ALL";
  const searchParam = searchParams.get("search") || "";

  useEffect(() => {
    async function loadPartners() {
      setIsLoading(true);
      try {
        const data = await partnerService.getPartners({
          status: statusParam,
          city: cityParam,
          search: searchParam,
        });
        setPartners(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadPartners();
  }, [statusParam, cityParam, searchParam]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "ALL" || !value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
    setCurrentPage(1);
  };

  const filterGroups = [
    {
      id: "status",
      label: "Account Status",
      value: statusParam,
      onChange: (v: string) => updateParam("status", v),
      options: [
        { label: "All Statuses", value: "ALL" },
        { label: "Active", value: "ACTIVE" },
        { label: "Pending", value: "PENDING" },
        { label: "Suspended", value: "SUSPENDED" },
        { label: "Rejected", value: "REJECTED" },
      ],
    },
    {
      id: "city",
      label: "City",
      value: cityParam,
      onChange: (v: string) => updateParam("city", v),
      options: [
        { label: "All Cities", value: "ALL" },
        { label: "Hyderabad", value: "Hyderabad" },
        { label: "Bangalore", value: "Bangalore" },
        { label: "Chennai", value: "Chennai" },
      ],
    },
  ];

  const columns: Column<Partner>[] = [
    {
      header: "Partner & Identity",
      className: "min-w-[220px]",
      accessor: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs shadow-2xs shrink-0">
            {p.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/partners/${p.id}`)}
              className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left text-xs block leading-snug"
            >
              {p.name}
            </button>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 whitespace-nowrap">
              <span className="inline-block whitespace-nowrap bg-slate-100/90 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200/60">
                {p.id}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{p.mobile}</span>
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Category & Zone",
      className: "min-w-[180px]",
      accessor: (p) => (
        <div>
          <p className="font-bold text-slate-900 text-xs">
            {p.serviceCategories.join(", ") || p.services[0]}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
            <span>{p.city}</span>
          </p>
        </div>
      ),
    },
    {
      header: "Account Status",
      className: "whitespace-nowrap min-w-[120px]",
      accessor: (p) => <StatusBadge status={p.status} />,
    },
    {
      header: "KYC Verification",
      className: "whitespace-nowrap min-w-[130px]",
      accessor: (p) => <StatusBadge status={p.verificationStatus} />,
    },
    {
      header: "Performance",
      className: "whitespace-nowrap min-w-[130px]",
      accessor: (p) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-900">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{p.rating || "New"}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {p.completedJobs} jobs done
          </p>
        </div>
      ),
    },
    {
      header: "Total Earnings",
      className: "whitespace-nowrap min-w-[130px]",
      accessor: (p) => (
        <div>
          <span className="font-extrabold text-slate-900 text-xs">
            ₹{p.totalEarnings.toLocaleString("en-IN")}
          </span>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Escrow: ₹{p.pendingPayout.toLocaleString("en-IN")}
          </p>
        </div>
      ),
    },
    {
      header: "Action",
      className: "whitespace-nowrap text-right min-w-[90px]",
      accessor: (p) => (
        <button
          type="button"
          onClick={() => navigate(`/partners/${p.id}`)}
          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all border border-slate-200/60 bg-white shadow-2xs inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1"
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
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
              <Users className="w-4.5 h-4.5" />
            </div>
            <span>Service Partner Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage onboarding, ratings, document verification, and account status across all service zones
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 border border-slate-200/80 rounded-2xl shadow-xs">
        <SearchInput
          value={searchParam}
          onChange={(v) => updateParam("search", v)}
          placeholder="Search by Partner ID, name, phone or skill..."
          className="w-full md:w-80"
        />

        <FilterBar
          groups={filterGroups}
          onReset={() => {
            setSearchParams(new URLSearchParams());
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table & Pagination */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={pagedPartners}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          emptyMessage="No service partners found matching criteria"
        />

        {partners.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(partners.length / pageSize)}
            totalItems={partners.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};
