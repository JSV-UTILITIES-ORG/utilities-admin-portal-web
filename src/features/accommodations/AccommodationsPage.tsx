import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { accommodationService } from "../../services/accommodationService";
import type {
  AccommodationListing,
  PGEnquiry,
  PGVisit,
} from "../../types/accommodation";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { MetricCard } from "../../components/ui/MetricCard";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { Modal } from "../../components/ui/Modal";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import {
  Home,
  Bed,
  Users,
  MapPin,
  Eye,
  Building,
  ShieldCheck,
  Search,
  CheckCircle,
  Calendar,
  Clock,
  Plus,
  PhoneCall,
  XCircle,
  Check,
} from "lucide-react";

export const AccommodationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState<AccommodationListing[]>([]);
  const [enquiries, setEnquiries] = useState<PGEnquiry[]>([]);
  const [visits, setVisits] = useState<PGVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "PROPERTIES" | "ENQUIRIES" | "VISITS"
  >("PROPERTIES");
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const [actionSuccess, setActionSuccess] = useState("");

  // Enquiry Action Modals
  const [selectedEnquiry, setSelectedEnquiry] = useState<PGEnquiry | null>(
    null,
  );
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [respondNotes, setRespondNotes] = useState("");

  const [isScheduleVisitModalOpen, setIsScheduleVisitModalOpen] =
    useState(false);
  const [visitDate, setVisitDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [visitTimeSlot, setVisitTimeSlot] = useState("11:00 AM - 12:00 PM");
  const [visitNotes, setVisitNotes] = useState("");

  const [isNewEnquiryModalOpen, setIsNewEnquiryModalOpen] = useState(false);
  const [newEnqListingId, setNewEnqListingId] = useState("");
  const [newEnqUserName, setNewEnqUserName] = useState("");
  const [newEnqUserMobile, setNewEnqUserMobile] = useState("");
  const [newEnqMoveInDate, setNewEnqMoveInDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [newEnqMessage, setNewEnqMessage] = useState("");

  const [isRejectEnqOpen, setIsRejectEnqOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [listData, enqData, visitData] = await Promise.all([
        accommodationService.getAccommodations({
          search: search || undefined,
          city: cityFilter === "ALL" ? undefined : cityFilter,
        }),
        accommodationService.getEnquiries(),
        accommodationService.getVisits(),
      ]);
      setListings(listData);
      setEnquiries(enqData);
      setVisits(visitData);
      if (listData.length > 0 && !newEnqListingId) {
        setNewEnqListingId(listData[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, cityFilter]);

  // Handle Accept / Respond to Enquiry
  const handleAcceptEnquiry = async () => {
    if (!selectedEnquiry) return;
    try {
      await accommodationService.acceptEnquiry(
        selectedEnquiry.id,
        respondNotes,
      );
      setActionSuccess(
        `Enquiry from ${selectedEnquiry.userName} accepted & marked as Contacted.`,
      );
      setIsRespondModalOpen(false);
      setRespondNotes("");
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to respond");
    }
  };

  // Handle Schedule Visit from Enquiry
  const handleScheduleVisit = async () => {
    if (!selectedEnquiry) return;
    try {
      await accommodationService.scheduleVisitFromEnquiry(
        selectedEnquiry.id,
        visitDate,
        visitTimeSlot,
        visitNotes,
      );
      setActionSuccess(
        `Physical site visit scheduled for ${selectedEnquiry.userName} on ${visitDate}!`,
      );
      setIsScheduleVisitModalOpen(false);
      setVisitNotes("");
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to schedule visit");
    }
  };

  // Handle Reject Enquiry
  const handleRejectEnquiry = async () => {
    if (!selectedEnquiry) return;
    try {
      await accommodationService.rejectEnquiry(
        selectedEnquiry.id,
        "No vacant beds matching resident criteria",
      );
      setActionSuccess(`Enquiry #${selectedEnquiry.id} closed.`);
      setIsRejectEnqOpen(false);
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to reject enquiry");
    }
  };

  // Handle Create New Enquiry
  const handleCreateNewEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnqListingId || !newEnqUserName.trim() || !newEnqUserMobile.trim())
      return;

    const listing = listings.find((l) => l.id === newEnqListingId);
    try {
      await accommodationService.createEnquiry({
        listingId: newEnqListingId,
        propertyName: listing?.propertyName || "PG Property",
        userId: `USR-${Date.now().toString().slice(-4)}`,
        userName: newEnqUserName,
        userMobile: newEnqUserMobile,
        moveInDate: newEnqMoveInDate,
        message: newEnqMessage,
      });

      setActionSuccess(`New enquiry submitted for "${listing?.propertyName}".`);
      setIsNewEnquiryModalOpen(false);
      setNewEnqUserName("");
      setNewEnqUserMobile("");
      setNewEnqMessage("");
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create enquiry");
    }
  };

  // Handle Update Visit Status
  const handleUpdateVisitStatus = async (
    visitId: string,
    status: PGVisit["status"],
  ) => {
    try {
      await accommodationService.updateVisitStatus(visitId, status);
      setActionSuccess(`Visit status updated to ${status}.`);
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update visit");
    }
  };

  // Metrics
  const totalProperties = listings.length;
  const pendingVerification = listings.filter(
    (l) => l.status === "UNDER_REVIEW" || l.status === "SUBMITTED",
  ).length;
  const totalBeds = listings.reduce((acc, l) => acc + l.totalBeds, 0);
  const availableBeds = listings.reduce((acc, l) => acc + l.availableBeds, 0);
  const totalJoins = listings.reduce((acc, l) => acc + l.joinsCount, 0);

  const cityOptions = [
    { label: "All Cities", value: "ALL" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Bangalore", value: "Bangalore" },
  ];

  const listingSelectOptions = listings.map((l) => ({
    label: `${l.propertyName} (${l.area}, ${l.city} • ₹${l.startingPriceMonthly}/mo)`,
    value: l.id,
  }));

  const timeSlotOptions = [
    { label: "10:00 AM - 11:00 AM", value: "10:00 AM - 11:00 AM" },
    { label: "11:00 AM - 12:00 PM", value: "11:00 AM - 12:00 PM" },
    { label: "02:00 PM - 03:00 PM", value: "02:00 PM - 03:00 PM" },
    { label: "04:00 PM - 05:00 PM", value: "04:00 PM - 05:00 PM" },
    { label: "06:00 PM - 07:00 PM", value: "06:00 PM - 07:00 PM" },
  ];

  const propertyColumns: Column<AccommodationListing>[] = [
    {
      header: "Property Name & Host",
      className: "min-w-[240px]",
      accessor: (l) => (
        <div>
          <button
            onClick={() => navigate(`/accommodations/${l.id}`)}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left text-xs block leading-snug"
          >
            {l.propertyName}
          </button>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 whitespace-nowrap">
            <span className="inline-block bg-slate-100/90 text-slate-700 font-semibold px-2 py-0.5 rounded-md text-[10px] border border-slate-200/60">
              {l.id}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <Building className="w-3 h-3 text-slate-400" />
              {l.ownerName}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "City & Area",
      className: "whitespace-nowrap min-w-[140px]",
      accessor: (l) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{l.city}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {l.area}
          </p>
        </div>
      ),
    },
    {
      header: "Bed Inventory",
      className: "whitespace-nowrap min-w-[150px]",
      accessor: (l) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <Bed className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              {l.availableBeds} / {l.totalBeds} Available
            </span>
          </div>
          <div className="w-28 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (1 - l.availableBeds / (l.totalBeds || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Monthly Rent",
      className: "whitespace-nowrap min-w-[120px]",
      accessor: (l) => (
        <div className="text-xs font-extrabold text-slate-900">
          ₹{l.startingPriceMonthly.toLocaleString()}{" "}
          <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
        </div>
      ),
    },
    {
      header: "Gender",
      className: "whitespace-nowrap min-w-[100px]",
      accessor: (l) => (
        <span
          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
            l.genderAllowed === "FEMALE"
              ? "bg-pink-50 text-pink-700 border border-pink-200"
              : l.genderAllowed === "MALE"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-purple-50 text-purple-700 border border-purple-200"
          }`}
        >
          {l.genderAllowed}
        </span>
      ),
    },
    {
      header: "Pipeline",
      className: "whitespace-nowrap min-w-[110px]",
      accessor: (l) => (
        <div className="text-[11px] text-slate-600 space-y-0.5">
          <div className="font-medium">{l.enquiriesCount} Enquiries</div>
          <div className="font-bold text-emerald-700">
            {l.joinsCount} Joined
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      className: "whitespace-nowrap min-w-[120px]",
      accessor: (l) => <StatusBadge status={l.status} />,
    },
    {
      header: "Action",
      className: "whitespace-nowrap text-right min-w-[80px]",
      accessor: (l) => (
        <button
          onClick={() => navigate(`/accommodations/${l.id}`)}
          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all border border-slate-200/60 bg-white shadow-2xs"
          title="Inspect Property & Verify Checklist"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const enquiryColumns: Column<PGEnquiry>[] = [
    {
      header: "Enquiry ID",
      className: "whitespace-nowrap w-28",
      accessor: (e) => (
        <span className="inline-block whitespace-nowrap bg-slate-100/90 text-slate-700 px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-slate-200/70">
          {e.id}
        </span>
      ),
    },
    {
      header: "PG Property",
      className: "min-w-[200px] max-w-[260px]",
      accessor: (e) => (
        <button
          onClick={() => navigate(`/accommodations/${e.listingId}`)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline text-left block leading-snug"
        >
          {e.propertyName}
        </button>
      ),
    },
    {
      header: "Tenant Details",
      className: "whitespace-nowrap min-w-[160px]",
      accessor: (e) => (
        <div className="text-xs">
          <div className="font-bold text-slate-900">{e.userName}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            {e.userMobile}
          </div>
        </div>
      ),
    },
    {
      header: "Target Move-In",
      className: "whitespace-nowrap min-w-[130px]",
      accessor: (e) => (
        <span className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{e.moveInDate}</span>
        </span>
      ),
    },
    {
      header: "Inquiry Message",
      className: "min-w-[220px]",
      accessor: (e) => (
        <span
          className="text-[11px] text-slate-500 block line-clamp-2"
          title={e.message}
        >
          {e.message || "Interested in PG accommodation"}
        </span>
      ),
    },
    {
      header: "Status",
      className: "whitespace-nowrap min-w-[130px]",
      accessor: (e) => <StatusBadge status={e.status} />,
    },
    {
      header: "Actions",
      className: "whitespace-nowrap text-right min-w-[170px]",
      accessor: (e) => (
        <div className="flex items-center justify-end gap-1.5">
          {e.status !== "DROPPED" && e.status !== "JOINED" && (
            <>
              {e.status === "NEW" && (
                <button
                  onClick={() => {
                    setSelectedEnquiry(e);
                    setIsRespondModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-200/80 shadow-2xs flex items-center gap-1 shrink-0"
                  title="Accept Enquiry & Contact Tenant"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Accept</span>
                </button>
              )}

              {e.status !== "VISIT_SCHEDULED" && (
                <button
                  onClick={() => {
                    setSelectedEnquiry(e);
                    setIsScheduleVisitModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-200/80 shadow-2xs flex items-center gap-1 shrink-0"
                  title="Schedule Site Visit Appointment"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Visit</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedEnquiry(e);
                  setIsRejectEnqOpen(true);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shrink-0"
                title="Drop / Reject"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}

          {e.status === "VISIT_SCHEDULED" && (
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/80 shadow-2xs">
              Visit Active
            </span>
          )}
        </div>
      ),
    },
  ];

  const visitColumns: Column<PGVisit>[] = [
    {
      header: "Visit ID",
      className: "whitespace-nowrap w-28",
      accessor: (v) => (
        <span className="inline-block whitespace-nowrap bg-slate-100/90 text-slate-700 px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-slate-200/70">
          {v.id}
        </span>
      ),
    },
    {
      header: "PG Property",
      className: "min-w-[200px] max-w-[260px]",
      accessor: (v) => (
        <button
          onClick={() => navigate(`/accommodations/${v.listingId}`)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline text-left block leading-snug"
        >
          {v.propertyName}
        </button>
      ),
    },
    {
      header: "Visitor Details",
      className: "whitespace-nowrap min-w-[160px]",
      accessor: (v) => (
        <div className="text-xs">
          <div className="font-bold text-slate-900">{v.userName}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            {v.userMobile}
          </div>
        </div>
      ),
    },
    {
      header: "Scheduled Appointment",
      className: "whitespace-nowrap min-w-[160px]",
      accessor: (v) => (
        <div className="text-xs">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{v.scheduledDate}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{v.timeSlot}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      className: "whitespace-nowrap min-w-[130px]",
      accessor: (v) => <StatusBadge status={v.status} />,
    },
    {
      header: "Visit Actions",
      className: "whitespace-nowrap text-right min-w-[150px]",
      accessor: (v) => (
        <div className="flex items-center justify-end gap-1.5">
          {v.status === "REQUESTED" && (
            <button
              onClick={() => handleUpdateVisitStatus(v.id, "CONFIRMED")}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs"
            >
              Confirm
            </button>
          )}

          {(v.status === "CONFIRMED" || v.status === "SCHEDULED") && (
            <button
              onClick={() => handleUpdateVisitStatus(v.id, "COMPLETED")}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-200/80 flex items-center gap-1 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Completed</span>
            </button>
          )}

          {v.status !== "CANCELLED" && v.status !== "COMPLETED" && (
            <button
              onClick={() => handleUpdateVisitStatus(v.id, "CANCELLED")}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Cancel Visit"
            >
              <XCircle className="w-4 h-4" />
            </button>
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
              <Home className="w-4.5 h-4.5" />
            </div>
            <span>Accommodation Marketplace (PG / Hostels)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Property verification checklists, tenant enquiry acceptance,
            scheduled visits, room & bed inventory, and joining commissions.
          </p>
        </div>
        {activeTab === "ENQUIRIES" && (
          <button
            onClick={() => setIsNewEnquiryModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Customer Enquiry</span>
          </button>
        )}
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
          title="Total Properties"
          value={totalProperties}
          subtitle="+1 this month"
          icon={<Home className="w-4 h-4 text-slate-600" />}
        />
        <MetricCard
          title="Pending Verification"
          value={pendingVerification}
          subtitle="Inspection required"
          icon={<ShieldCheck className="w-4 h-4 text-amber-600" />}
        />
        <MetricCard
          title="Bed Inventory"
          value={`${availableBeds} / ${totalBeds}`}
          subtitle="Beds available"
          icon={<Bed className="w-4 h-4 text-blue-600" />}
        />
        <MetricCard
          title="Confirmed Joins"
          value={totalJoins}
          subtitle="Generated commissions"
          icon={<Users className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Segmented Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab("PROPERTIES")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "PROPERTIES"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Properties & Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab("ENQUIRIES")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "ENQUIRIES"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Enquiries Pipeline & Acceptance ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("VISITS")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "VISITS"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Scheduled Visits ({visits.length})
          </button>
        </div>

        {activeTab === "PROPERTIES" && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search property, area..."
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
        )}
      </div>

      {/* Render Active View */}
      {activeTab === "PROPERTIES" && (
        <DataTable
          data={listings}
          columns={propertyColumns}
          keyExtractor={(l) => l.id}
          isLoading={isLoading}
          emptyMessage="No accommodation properties found."
        />
      )}

      {activeTab === "ENQUIRIES" && (
        <DataTable
          data={enquiries}
          columns={enquiryColumns}
          keyExtractor={(e) => e.id}
          isLoading={isLoading}
          emptyMessage="No PG enquiries recorded yet."
        />
      )}

      {activeTab === "VISITS" && (
        <DataTable
          data={visits}
          columns={visitColumns}
          keyExtractor={(v) => v.id}
          isLoading={isLoading}
          emptyMessage="No property visits scheduled yet."
        />
      )}

      {/* Accept & Respond to Enquiry Modal */}
      <Modal
        isOpen={isRespondModalOpen}
        onClose={() => setIsRespondModalOpen(false)}
        title={`Accept & Respond to Enquiry: ${selectedEnquiry?.userName}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Accept this tenant enquiry for{" "}
            <b>{selectedEnquiry?.propertyName}</b> and send host contact
            details:
          </p>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-800">
              Tenant: {selectedEnquiry?.userName} ({selectedEnquiry?.userMobile}
              )
            </div>
            <div className="text-slate-500 font-medium">
              Move-In Target: {selectedEnquiry?.moveInDate}
            </div>
            {selectedEnquiry?.message && (
              <div className="text-slate-600 italic mt-1 bg-white p-2.5 rounded-xl border border-slate-200/80">
                "{selectedEnquiry.message}"
              </div>
            )}
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Response Note / Host Phone
            </label>
            <textarea
              rows={3}
              value={respondNotes}
              onChange={(e) => setRespondNotes(e.target.value)}
              placeholder="e.g. Contacted user. Shared PG manager's direct contact (+91 98450 11223) for physical visit..."
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsRespondModalOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAcceptEnquiry}
              className="px-4 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Confirm & Accept</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Schedule Visit Modal */}
      <Modal
        isOpen={isScheduleVisitModalOpen}
        onClose={() => setIsScheduleVisitModalOpen(false)}
        title={`Schedule Site Visit for ${selectedEnquiry?.userName}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Set an appointment date and time slot for physical inspection of{" "}
            <b>{selectedEnquiry?.propertyName}</b>:
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <CustomSelect
                label="Time Slot *"
                options={timeSlotOptions}
                value={visitTimeSlot}
                onChange={(val) => setVisitTimeSlot(val)}
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Visit Instructions
            </label>
            <textarea
              rows={2}
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              placeholder="e.g. Meet PG Warden Mr. Ramesh at the reception..."
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsScheduleVisitModalOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleVisit}
              className="px-4 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
            >
              Schedule Appointment
            </button>
          </div>
        </div>
      </Modal>

      {/* Create New Enquiry Modal */}
      <Modal
        isOpen={isNewEnquiryModalOpen}
        onClose={() => setIsNewEnquiryModalOpen(false)}
        title="Submit New Prospective Tenant Enquiry"
        maxWidth="md"
      >
        <form onSubmit={handleCreateNewEnquiry} className="space-y-3.5 text-xs">
          <div>
            <CustomSelect
              label="Select PG Property *"
              options={listingSelectOptions}
              value={newEnqListingId}
              onChange={(val) => setNewEnqListingId(val)}
              searchable={true}
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tenant Full Name *
            </label>
            <input
              type="text"
              required
              value={newEnqUserName}
              onChange={(e) => setNewEnqUserName(e.target.value)}
              placeholder="e.g. Priya Nair"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tenant Mobile *
              </label>
              <input
                type="tel"
                required
                value={newEnqUserMobile}
                onChange={(e) => setNewEnqUserMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Move-In Date
              </label>
              <input
                type="date"
                value={newEnqMoveInDate}
                onChange={(e) => setNewEnqMoveInDate(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Inquiry / Preference Message
            </label>
            <textarea
              rows={2}
              value={newEnqMessage}
              onChange={(e) => setNewEnqMessage(e.target.value)}
              placeholder="e.g. Inquiring about single occupancy AC room with food included..."
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewEnquiryModalOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors"
            >
              Submit Enquiry
            </button>
          </div>
        </form>
      </Modal>

      {/* Reject Enquiry Dialog */}
      <ConfirmationDialog
        isOpen={isRejectEnqOpen}
        onClose={() => setIsRejectEnqOpen(false)}
        onConfirm={handleRejectEnquiry}
        title="Drop / Reject Tenant Enquiry"
        message={`Mark enquiry #${selectedEnquiry?.id} from ${selectedEnquiry?.userName} as dropped/closed?`}
        confirmLabel="Drop Enquiry"
        isDestructive={true}
      />
    </div>
  );
};
