import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { accommodationService } from "../../services/accommodationService";
import type {
  AccommodationListing,
  VerificationChecklist,
  PGJoining,
  Room,
  Bed,
} from "../../types/accommodation";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Modal } from "../../components/ui/Modal";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { useAuth } from "../auth/AuthContext";
import {
  ArrowLeft,
  Bed as BedIcon,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Phone,
  Users,
  Plus,
  FileCheck,
  UserCheck,
  RotateCcw,
} from "lucide-react";

export const AccommodationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [listing, setListing] = useState<AccommodationListing | null>(null);
  const [joinings, setJoinings] = useState<PGJoining[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState("");

  // Verification Checklist State
  const [checklist, setChecklist] = useState<VerificationChecklist>({
    addressVerified: false,
    photosVerified: false,
    amenitiesVerified: false,
    inventoryVerified: false,
    ownerVerified: false,
    notes: "",
  });

  // Modals
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isVacateModalOpen, setIsVacateModalOpen] = useState(false);
  const [selectedVacateBed, setSelectedVacateBed] = useState<{
    roomId: string;
    bedId: string;
    bedNumber: string;
    tenantName: string;
  } | null>(null);

  // Bed Assignment / Allotment Form State
  const [joinUserName, setJoinUserName] = useState("");
  const [joinUserMobile, setJoinUserMobile] = useState("");
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");
  const [selectedBedNumber, setSelectedBedNumber] = useState("");
  const [joinRent, setJoinRent] = useState(10000);
  const [joinDeposit, setJoinDeposit] = useState(5000);
  const [joinCommType, setJoinCommType] = useState<"FIXED" | "PERCENTAGE">("PERCENTAGE");
  const joinCommRate = 15;

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [data, joins] = await Promise.all([
        accommodationService.getAccommodationById(id),
        accommodationService.getJoinings(id),
      ]);
      setListing(data);
      setJoinings(joins);
      if (data?.verificationChecklist) {
        setChecklist(data.verificationChecklist);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleVerifyAndPublish = async () => {
    if (!listing) return;
    try {
      await accommodationService.verifyAndPublishListing(listing.id, checklist, admin?.id);
      setActionSuccess(`Listing "${listing.propertyName}" verified and published successfully!`);
      setIsVerifyModalOpen(false);
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to verify listing");
    }
  };

  const openAssignBedModal = (room: Room, bed: Bed) => {
    setSelectedRoomNumber(room.roomNumber);
    setSelectedBedNumber(bed.bedNumber);
    setJoinRent(room.rentPerBed);
    setJoinDeposit(room.rentPerBed / 2);
    setJoinUserName("");
    setJoinUserMobile("");
    setIsJoinModalOpen(true);
  };

  const handleCreateJoining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !joinUserName.trim() || !joinUserMobile.trim()) return;

    try {
      const { commission } = await accommodationService.confirmJoining(
        {
          listingId: listing.id,
          propertyName: listing.propertyName,
          ownerPartnerId: listing.ownerPartnerId,
          ownerName: listing.ownerName,
          userId: `USR-${Date.now().toString().slice(-4)}`,
          userName: joinUserName,
          userMobile: joinUserMobile,
          roomNumber: selectedRoomNumber || "101",
          bedNumber: selectedBedNumber || "101-A",
          moveInDate: new Date().toISOString().slice(0, 10),
          monthlyRent: joinRent,
          securityDeposit: joinDeposit,
          commissionType: joinCommType,
          commissionRate: joinCommRate,
          commissionStatus: "INVOICED",
        },
        admin?.id
      );

      setListing((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          availableBeds: Math.max(0, prev.availableBeds - 1),
          joinsCount: prev.joinsCount + 1,
          rooms: prev.rooms.map((room) => {
            if (room.roomNumber !== selectedRoomNumber) return room;
            return {
              ...room,
              beds: room.beds.map((bed) => {
                if (bed.bedNumber !== selectedBedNumber) return bed;
                return { ...bed, isOccupied: true, occupiedByUserName: joinUserName };
              }),
            };
          }),
        };
      });

      setActionSuccess(
        `Bed ${selectedBedNumber} assigned to ${joinUserName}! Generated platform commission: ₹${commission.totalReceivable} (Invoice: ${commission.invoiceNumber}).`
      );
      setIsJoinModalOpen(false);
      loadData();
      setTimeout(() => setActionSuccess(""), 5000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to confirm joining");
    }
  };

  const handleVacateBed = async () => {
    if (!listing || !selectedVacateBed) return;
    setListing((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        availableBeds: prev.availableBeds + 1,
        rooms: prev.rooms.map((room) => {
          if (room.id !== selectedVacateBed.roomId) return room;
          return {
            ...room,
            beds: room.beds.map((bed) => {
              if (bed.id !== selectedVacateBed.bedId) return bed;
              return { ...bed, isOccupied: false, occupiedByUserName: undefined };
            }),
          };
        }),
      };
    });
    setActionSuccess(`Bed ${selectedVacateBed.bedNumber} has been marked vacant & ready for re-allotment.`);
    setIsVacateModalOpen(false);
    setSelectedVacateBed(null);
    setTimeout(() => setActionSuccess(""), 4000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800">Property Listing Not Found</h2>
        <button
          onClick={() => navigate("/accommodations")}
          className="mt-3 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  const isPublished = listing.status === "PUBLISHED";

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => navigate("/accommodations")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Accommodation Marketplace</span>
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={listing.status} />

          {!isPublished ? (
            <button
              onClick={() => setIsVerifyModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Perform Verification</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verified & Live on Marketplace</span>
            </div>
          )}

          <button
            onClick={() => {
              setSelectedRoomNumber(listing.rooms[0]?.roomNumber || "101");
              setSelectedBedNumber(listing.rooms[0]?.beds[0]?.bedNumber || "101-A");
              setJoinRent(listing.rooms[0]?.rentPerBed || 10000);
              setJoinDeposit((listing.rooms[0]?.rentPerBed || 10000) / 2);
              setIsJoinModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Confirm Move-In / Allot Bed</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Main Property Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px] text-slate-600 font-bold">
                {listing.id}
              </span>
              <span>•</span>
              <span>Host / Owner: {listing.ownerName}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1.5">{listing.propertyName}</h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {listing.area}, {listing.city} ({listing.pincode})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {listing.ownerMobile}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Bed Vacancy
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {listing.availableBeds} / {listing.totalBeds} Vacant
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Starting Rent
              </div>
              <div className="text-base font-bold text-emerald-600 mt-0.5">
                ₹{listing.startingPriceMonthly.toLocaleString()} / mo
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Gender
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">{listing.genderAllowed}</div>
            </div>
          </div>
        </div>

        {/* Photos Preview */}
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
            Property Photographs
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {listing.photos.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Property view ${idx + 1}`}
                className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-2xs"
              />
            ))}
          </div>
        </div>

        {/* Amenities & Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-2.5">
              Amenities Included
            </span>
            <div className="flex flex-wrap gap-1.5">
              {listing.amenities.map((am, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200/80 rounded-lg text-xs font-medium shadow-2xs"
                >
                  {am}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-2.5">
              House Rules & Guidelines
            </span>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              {listing.houseRules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Room & Bed Assignment Matrix (BRD Section 7.1) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BedIcon className="w-4 h-4 text-blue-600" />
              <span>Room & Bed Assignment & Allotment Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on any vacant bed to immediately assign & allot it to an incoming resident.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {listing.rooms.map((room) => (
            <div key={room.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-slate-900">Room {room.roomNumber}</div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {room.sharingType.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Rent: ₹{room.rentPerBed.toLocaleString()} / bed</span>
                <span className="font-semibold text-slate-700">{room.hasAc ? "AC Room" : "Non-AC"}</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">Bed Allotments</div>
                {room.beds.map((bed) => (
                  <div
                    key={bed.id}
                    className="flex items-center justify-between text-xs p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                        {bed.bedNumber}
                      </span>
                      {bed.isOccupied ? (
                        <div className="text-[11px] text-slate-700 flex items-center gap-1 font-semibold">
                          <Users className="w-3 h-3 text-blue-600" />
                          <span>{bed.occupiedByUserName || "Occupied"}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Vacant
                        </span>
                      )}
                    </div>

                    {bed.isOccupied ? (
                      <button
                        onClick={() => {
                          setSelectedVacateBed({
                            roomId: room.id,
                            bedId: bed.id,
                            bedNumber: bed.bedNumber,
                            tenantName: bed.occupiedByUserName || "Tenant",
                          });
                          setIsVacateModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-[10px] flex items-center gap-1 font-medium"
                        title="Vacate Bed"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Vacate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openAssignBedModal(room, bed)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors flex items-center gap-1 border border-blue-200/80 shadow-2xs"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Assign Bed</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmed Joins & Generated Commission History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Move-In Confirmations & Generated Commissions ({joinings.length})</span>
        </h2>

        {joinings.length === 0 ? (
          <p className="text-xs text-slate-400 italic p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-center">
            No move-in joining records registered yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Joining ID</th>
                  <th className="p-3">Resident</th>
                  <th className="p-3">Room & Bed</th>
                  <th className="p-3">Move-In Date</th>
                  <th className="p-3">Monthly Rent</th>
                  <th className="p-3">Commission</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {joinings.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-semibold text-slate-800">{j.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{j.userName}</div>
                      <div className="text-[11px] text-slate-500">{j.userMobile}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">
                      Room {j.roomNumber} ({j.bedNumber})
                    </td>
                    <td className="p-3 text-slate-600">{j.moveInDate}</td>
                    <td className="p-3 font-semibold text-slate-800">₹{j.monthlyRent.toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-700">
                      ₹{j.commissionAmount.toLocaleString()}{" "}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({j.commissionType === "PERCENTAGE" ? `${j.commissionRate}%` : "Fixed"})
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {j.commissionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Checklist Modal */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Admin Verification Checklist"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Verify all physical and legal aspects of "{listing.propertyName}" before publishing to the Stay marketplace:
          </p>

          <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.addressVerified}
                onChange={(e) => setChecklist({ ...checklist, addressVerified: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="font-semibold text-slate-800">Address & Geo-Coordinates Verified</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.photosVerified}
                onChange={(e) => setChecklist({ ...checklist, photosVerified: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="font-semibold text-slate-800">Photos & Room Views Verified Authentic</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.amenitiesVerified}
                onChange={(e) => setChecklist({ ...checklist, amenitiesVerified: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="font-semibold text-slate-800">Amenities (Wi-Fi, Food, AC, Water) Operational</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.inventoryVerified}
                onChange={(e) => setChecklist({ ...checklist, inventoryVerified: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="font-semibold text-slate-800">Room & Bed Count Matches Submission</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.ownerVerified}
                onChange={(e) => setChecklist({ ...checklist, ownerVerified: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="font-semibold text-slate-800">Host Identity & Ownership / Lease Agreement Verified</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Verification Audit Notes</label>
            <textarea
              rows={2}
              value={checklist.notes || ""}
              onChange={(e) => setChecklist({ ...checklist, notes: e.target.value })}
              placeholder="e.g. Physical visit conducted by operations lead..."
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsVerifyModalOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyAndPublish}
              className="px-4 py-1.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors"
            >
              Verify & Publish Listing
            </button>
          </div>
        </div>
      </Modal>

      {/* Bed Assignment / Move-In Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title={`Allot Bed to Tenant: Room ${selectedRoomNumber} (Bed ${selectedBedNumber})`}
        maxWidth="md"
      >
        <form onSubmit={handleCreateJoining} className="space-y-3.5 text-xs">
          <p className="text-slate-600">
            Assign bed <b>{selectedBedNumber}</b> in <b>Room {selectedRoomNumber}</b> ({listing.propertyName}) to an incoming resident:
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resident Full Name *</label>
            <input
              type="text"
              required
              value={joinUserName}
              onChange={(e) => setJoinUserName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resident Mobile Number *</label>
            <input
              type="tel"
              required
              value={joinUserMobile}
              onChange={(e) => setJoinUserMobile(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Room No.</label>
              <input
                type="text"
                readOnly
                value={selectedRoomNumber}
                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bed No.</label>
              <input
                type="text"
                readOnly
                value={selectedBedNumber}
                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                value={joinRent}
                onChange={(e) => setJoinRent(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                value={joinDeposit}
                onChange={(e) => setJoinDeposit(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 space-y-2">
            <div className="font-bold text-emerald-900">Platform Joining Commission Rule</div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="commType"
                  checked={joinCommType === "PERCENTAGE"}
                  onChange={() => setJoinCommType("PERCENTAGE")}
                />
                <span>Percentage (15% of 1st mo rent)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="commType"
                  checked={joinCommType === "FIXED"}
                  onChange={() => setJoinCommType("FIXED")}
                />
                <span>Fixed (₹2,000)</span>
              </label>
            </div>
            <div className="text-emerald-800 font-semibold pt-1">
              Estimated Commission: ₹
              {joinCommType === "PERCENTAGE"
                ? Math.round((joinRent * joinCommRate) / 100).toLocaleString()
                : "2,000"}{" "}
              (+ 18% GST)
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
            >
              Confirm Allotment & Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Vacate Bed Dialog */}
      <ConfirmationDialog
        isOpen={isVacateModalOpen}
        onClose={() => setIsVacateModalOpen(false)}
        onConfirm={handleVacateBed}
        title="Mark Bed as Vacant"
        message={`Mark bed ${selectedVacateBed?.bedNumber} as vacated by ${selectedVacateBed?.tenantName}? The bed will immediately become available for new resident allotment.`}
        confirmLabel="Confirm Vacate"
        isDestructive={false}
      />
    </div>
  );
};
