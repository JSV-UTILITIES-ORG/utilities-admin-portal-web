import React, { useState } from "react";
import { Settings, Save, CheckCircle } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const [platformRadius, setPlatformRadius] = useState(15);
  const [assignmentTimeout, setAssignmentTimeout] = useState(45);
  const [takeRateCommission, setTakeRateCommission] = useState(15);
  const [autoApproveOCR, setAutoApproveOCR] = useState(false);
  const [emergencySlaMinutes, setEmergencySlaMinutes] = useState(30);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Operational settings and platform parameters updated.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <span>Platform Operational Settings & SLAs</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure dispatch heuristics, matching timeouts, commission rates,
          and compliance rules
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Dispatch Heuristics */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Dispatch & Geo-Radius Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Partner Search Radius (km)
              </label>
              <input
                type="number"
                value={platformRadius}
                onChange={(e) => setPlatformRadius(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Maximum technician radius around customer address
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assignment SLA Timeout (Minutes)
              </label>
              <input
                type="number"
                value={assignmentTimeout}
                onChange={(e) => setAssignmentTimeout(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Triggers ASSIGNMENT_FAILED alert after threshold
              </p>
            </div>
          </div>
        </div>

        {/* Financial Commissions */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Take-Rate & Commissions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Platform Take-Rate (%)
              </label>
              <input
                type="number"
                value={takeRateCommission}
                onChange={(e) => setTakeRateCommission(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Commission deducted prior to partner escrow settlement
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Support Resolution SLA (Minutes)
              </label>
              <input
                type="number"
                value={emergencySlaMinutes}
                onChange={(e) => setEmergencySlaMinutes(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                High priority ticket response deadline
              </p>
            </div>
          </div>
        </div>

        {/* Automated KYC OCR */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Automated Aadhaar OCR Pre-Approval
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automatically parse government IDs and approve verified Aadhaar
              numbers instantly
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoApproveOCR}
            onChange={(e) => setAutoApproveOCR(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
