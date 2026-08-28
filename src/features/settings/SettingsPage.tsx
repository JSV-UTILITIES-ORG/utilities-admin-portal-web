import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle,
  Percent,
  Wrench,
  Shield,
} from "lucide-react";
import { CustomSelect } from "../../components/ui/CustomSelect";

export const SettingsPage: React.FC = () => {
  const [platformRadius, setPlatformRadius] = useState(15);
  const [assignmentTimeout, setAssignmentTimeout] = useState(45);
  const [serviceTakeRate, setServiceTakeRate] = useState(15);
  const [pgFixedCommission, setPgFixedCommission] = useState(2000);
  const [pgPercentageCommission, setPgPercentageCommission] = useState(15);
  const [pgCommissionMode, setPgCommissionMode] = useState<
    "PERCENTAGE" | "FIXED"
  >("PERCENTAGE");
  const [autoApproveOCR, setAutoApproveOCR] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(
      "Operational settings and dynamic commission rules updated successfully.",
    );
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const commissionModeOptions = [
    { label: "Percentage of 1st Month Rent", value: "PERCENTAGE" },
    { label: "Fixed ₹ Flat Fee per Joining", value: "FIXED" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>Platform Operational & Commission Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure dispatch thresholds, SLA timers, and dynamic commission
          percentages across all 3 marketplaces.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Service Marketplace Dispatch Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span>Service Dispatch & Operations SLA</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matching Geo-Radius (km)
              </label>
              <input
                type="number"
                value={platformRadius}
                onChange={(e) => setPlatformRadius(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Maximum search radius to query eligible partners for pending
                service requests.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Partner Acceptance Timeout (seconds)
              </label>
              <input
                type="number"
                value={assignmentTimeout}
                onChange={(e) => setAssignmentTimeout(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Time before auto-marking an unacknowledged assignment as
                ASSIGNMENT_FAILED.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Platform Commission Engine */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>Configurable Commission Engine (No Hard-Coding)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Home Services Take-Rate (%)
              </label>
              <input
                type="number"
                value={serviceTakeRate}
                onChange={(e) => setServiceTakeRate(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Platform deduction on completed service bookings before partner
                settlement.
              </p>
            </div>

            <div>
              <CustomSelect
                label="PG Move-In Commission Mode"
                options={commissionModeOptions}
                value={pgCommissionMode}
                onChange={(val) =>
                  setPgCommissionMode(val as "PERCENTAGE" | "FIXED")
                }
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Rule applied upon confirmed move-in (The platform never collects
                monthly rent).
              </p>
            </div>
          </div>

          {pgCommissionMode === "PERCENTAGE" ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PG Joining Commission Percentage (%)
              </label>
              <input
                type="number"
                value={pgPercentageCommission}
                onChange={(e) =>
                  setPgPercentageCommission(Number(e.target.value))
                }
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fixed Joining Fee (₹)
              </label>
              <input
                type="number"
                value={pgFixedCommission}
                onChange={(e) => setPgFixedCommission(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Real-Time Verification Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Automated Verification & Fraud Guard</span>
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoApproveOCR}
              onChange={(e) => setAutoApproveOCR(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Auto-Approve Partners with ≥ 90% DigiLocker & NSDL Name Match
              </span>
              <span className="text-[10px] text-slate-400">
                Instantly approves partner find-work capabilities when automated
                confidence exceeds threshold.
              </span>
            </div>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Operational Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
