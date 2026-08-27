import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { bookingService } from "../../services/bookingService";
import type {
  Booking,
  BookingStatus,
  AssignmentStatus,
} from "../../types/booking";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { SearchInput } from "../../components/ui/SearchInput";
import { FilterBar, type FilterGroup } from "../../components/ui/FilterBar";
import { Pagination } from "../../components/ui/Pagination";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { CalendarCheck, Eye } from "lucide-react";

export const BookingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusParam = searchParams.get("status") || "ALL";
  const assignmentParam = searchParams.get("assignment") || "ALL";
  const cityParam = searchParams.get("city") || "ALL";
  const searchParam = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getBookings({
        search: searchParam,
        status: statusParam as BookingStatus | "ALL",
        assignmentStatus: assignmentParam as AssignmentStatus | "ALL",
        city: cityParam,
      });
      setBookings(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
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
        { label: "Assignment Failed", value: "ASSIGNMENT_FAILED" },
        { label: "Payment Failed", value: "PAYMENT_FAILED" },
        { label: "Disputed", value: "DISPUTED" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
      onChange: (v) => updateParam("status", v),
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

  const columns: Column<Booking>[] = [
    {
      header: "Booking ID",
      accessor: (b) => (
        <div className="font-mono font-bold text-slate-900">#{b.id}</div>
      ),
    },
    {
      header: "Customer",
      accessor: (b) => (
        <div>
          <p className="font-bold text-slate-900">{b.customerName}</p>
          <p className="text-[11px] text-slate-400 font-mono">
            {b.customerMobile}
          </p>
        </div>
      ),
    },
    {
      header: "Service & Category",
      accessor: (b) => (
        <div>
          <p className="font-semibold text-slate-900">{b.serviceName}</p>
          <p className="text-[11px] text-slate-400">
            {b.categoryName} • {b.city}
          </p>
        </div>
      ),
    },
    {
      header: "Partner",
      accessor: (b) => (
        <div>
          {b.partnerName ? (
            <span className="font-medium text-slate-800">{b.partnerName}</span>
          ) : (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
              Unassigned
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (b) => <StatusBadge status={b.status} />,
    },
    {
      header: "Payment",
      accessor: (b) => (
        <div>
          <span className="font-bold text-slate-900">
            ₹{b.amount.toLocaleString("en-IN")}
          </span>
          <div className="mt-0.5">
            <StatusBadge status={b.paymentStatus} className="text-[10px]" />
          </div>
        </div>
      ),
    },
    {
      header: "Scheduled / Created",
      accessor: (b) => (
        <div className="text-xs text-slate-500">
          <p className="font-medium text-slate-800">{b.scheduledAt}</p>
          <p className="text-[11px] text-slate-400 font-mono">
            Booked: {b.createdAt}
          </p>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (b) => (
        <button
          type="button"
          onClick={() => navigate(`/bookings/${b.id}`)}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
      ),
    },
  ];

  const pagedBookings = bookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span>Bookings Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor, assign, reassign and troubleshoot all service customer
            requests
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs">
        <SearchInput
          value={searchParam}
          onChange={(v) => updateParam("search", v)}
          placeholder="Search by Booking ID, customer, service or partner..."
          className="w-full md:w-80"
        />

        <FilterBar
          groups={filterGroups}
          onReset={() => setSearchParams(new URLSearchParams())}
        />
      </div>

      {/* Table */}
      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={pagedBookings}
          keyExtractor={(b) => b.id}
          isLoading={isLoading}
          onRowClick={(b) => navigate(`/bookings/${b.id}`)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(bookings.length / pageSize)}
          totalItems={bookings.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};
