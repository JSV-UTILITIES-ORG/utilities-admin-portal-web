import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { bookingService } from "../../services/bookingService";
import type { Booking, BookingStatus } from "../../types/booking";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SearchInput } from "../../components/ui/SearchInput";
import { FilterBar } from "../../components/ui/FilterBar";
import { Pagination } from "../../components/ui/Pagination";
import { Eye, CalendarCheck, User, Phone, MapPin } from "lucide-react";

export const BookingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const statusParam = (searchParams.get("status") as BookingStatus) || "ALL";
  const cityParam = searchParams.get("city") || "ALL";
  const categoryParam = searchParams.get("category") || "ALL";
  const searchParam = searchParams.get("search") || "";

  useEffect(() => {
    async function loadBookings() {
      setIsLoading(true);
      try {
        const data = await bookingService.getBookings({
          status: statusParam,
          city: cityParam,
          serviceCategory: categoryParam,
          search: searchParam,
        });
        setBookings(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookings();
  }, [statusParam, cityParam, categoryParam, searchParam]);

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
      label: "Status",
      value: statusParam,
      onChange: (v: string) => updateParam("status", v),
      options: [
        { label: "All Statuses", value: "ALL" },
        { label: "Pending", value: "PENDING" },
        { label: "Assigned", value: "ASSIGNED" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
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
    {
      id: "category",
      label: "Category",
      value: categoryParam,
      onChange: (v: string) => updateParam("category", v),
      options: [
        { label: "All Categories", value: "ALL" },
        { label: "AC Repair", value: "AC Repair" },
        { label: "Plumbing", value: "Plumbing" },
        { label: "Electrician", value: "Electrician" },
        { label: "Cleaning", value: "Cleaning" },
      ],
    },
  ];

  const columns: Column<Booking>[] = [
    {
      header: "Booking & Customer",
      className: "min-w-[220px]",
      accessor: (b) => (
        <div className="py-0.5">
          <button
            type="button"
            onClick={() => navigate(`/bookings/${b.id}`)}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left text-xs block leading-snug"
          >
            {b.id}
          </button>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-800 font-bold">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{b.customerName}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-medium">
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{b.customerMobile}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Service & Category",
      className: "min-w-[180px]",
      accessor: (b) => (
        <div>
          <p className="font-bold text-slate-900 text-xs">{b.serviceName}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
            <span>{b.categoryName} • {b.city}</span>
          </p>
        </div>
      ),
    },
    {
      header: "Partner",
      className: "whitespace-nowrap min-w-[140px]",
      accessor: (b) => (
        <div>
          {b.partnerName ? (
            <span className="font-bold text-slate-800 text-xs">{b.partnerName}</span>
          ) : (
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              Unassigned
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      className: "whitespace-nowrap min-w-[120px]",
      accessor: (b) => <StatusBadge status={b.status} />,
    },
    {
      header: "Payment",
      className: "whitespace-nowrap min-w-[120px]",
      accessor: (b) => (
        <div>
          <span className="font-extrabold text-slate-900 text-xs">
            ₹{b.amount.toLocaleString("en-IN")}
          </span>
          <div className="mt-1">
            <StatusBadge status={b.paymentStatus} className="text-[10px]" />
          </div>
        </div>
      ),
    },
    {
      header: "Scheduled / Created",
      className: "whitespace-nowrap min-w-[150px]",
      accessor: (b) => (
        <div className="text-xs text-slate-600">
          <p className="font-bold text-slate-800">{b.scheduledAt}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Booked: {b.createdAt}
          </p>
        </div>
      ),
    },
    {
      header: "Action",
      className: "whitespace-nowrap text-right min-w-[90px]",
      accessor: (b) => (
        <button
          type="button"
          onClick={() => navigate(`/bookings/${b.id}`)}
          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all border border-slate-200/60 bg-white shadow-2xs inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1"
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
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
              <CalendarCheck className="w-4.5 h-4.5" />
            </div>
            <span>Bookings Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor, assign, reassign and troubleshoot customer service bookings
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 border border-slate-200/80 rounded-2xl shadow-xs">
        <SearchInput
          value={searchParam}
          onChange={(v) => updateParam("search", v)}
          placeholder="Search by Booking ID, customer, service or partner..."
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
          data={pagedBookings}
          keyExtractor={(b) => b.id}
          isLoading={isLoading}
          emptyMessage="No bookings match your current criteria"
        />

        {bookings.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(bookings.length / pageSize)}
            totalItems={bookings.length}
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
