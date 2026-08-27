import React, { useEffect, useState } from "react";
import { serviceService } from "../../services/serviceService";
import type { Service, ServiceCategory } from "../../types/service";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../auth/AuthContext";
import { Wrench, Plus, CheckCircle } from "lucide-react";

export const ServicesPage: React.FC = () => {
  const { admin } = useAuth();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newBasePrice, setNewBasePrice] = useState(499);
  const [newDuration, setNewDuration] = useState(60);
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, servs] = await Promise.all([
        serviceService.getCategories(),
        serviceService.getServices(),
      ]);
      setCategories(cats);
      setServices(servs);
      if (cats.length > 0) setNewCategoryId(cats[0].id);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    const cat = categories.find((c) => c.id === newCategoryId);
    await serviceService.createService(
      {
        name: newServiceName,
        categoryId: newCategoryId,
        categoryName: cat?.name || "General",
        basePrice: Number(newBasePrice),
        duration: Number(newDuration),
        status: "ACTIVE",
        description: `${newServiceName} professional service`,
      },
      admin?.name || "Admin",
    );
    setIsNewServiceOpen(false);
    setNewServiceName("");
    setActionSuccess(`New service "${newServiceName}" added to catalog.`);
    loadData();
  };

  const handleToggle = async (s: Service) => {
    await serviceService.toggleServiceStatus(s.id, admin?.name || "Admin");
    loadData();
  };

  const columns: Column<Service>[] = [
    {
      header: "Service Name",
      accessor: (s) => (
        <div>
          <p className="font-bold text-slate-900">{s.name}</p>
          <p className="text-[11px] text-slate-500">{s.description}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (s) => (
        <span className="font-semibold text-slate-800">{s.categoryName}</span>
      ),
    },
    {
      header: "Base Price",
      accessor: (s) => (
        <span className="font-bold text-slate-900 font-heading">
          ₹{s.basePrice.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Estimated Duration",
      accessor: (s) => (
        <span className="text-xs text-slate-600 font-mono">
          {s.duration} mins
        </span>
      ),
    },
    {
      header: "Catalog Status",
      accessor: (s) => <StatusBadge status={s.status} />,
    },
    {
      header: "Toggle",
      accessor: (s) => (
        <button
          type="button"
          onClick={() => handleToggle(s)}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
            s.status === "ACTIVE"
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
          }`}
        >
          {s.status === "ACTIVE" ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <span>Service Catalog & Pricing Tier</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure service verticals, standard duration SLAs, base rates and
            visibility
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewServiceOpen(true)}
          className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Categories Horizontal Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs flex flex-col justify-between"
          >
            <p className="text-xs font-bold text-slate-900">{c.name}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              {c.serviceCount} services
            </p>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={services}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
      />

      {/* New Service Modal */}
      <Modal
        isOpen={isNewServiceOpen}
        onClose={() => setIsNewServiceOpen(false)}
        title="Add Service to Catalog"
        subtitle="Create a new marketplace service item with base pricing"
      >
        <form onSubmit={handleCreateService} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="e.g. Inverter Repair & Diagnostics"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={newCategoryId}
                onChange={(e) => setNewCategoryId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Price (₹)
              </label>
              <input
                type="number"
                value={newBasePrice}
                onChange={(e) => setNewBasePrice(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Duration (Minutes)
            </label>
            <input
              type="number"
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewServiceOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              Save Service
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
