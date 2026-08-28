import React, { useEffect, useState } from "react";
import { serviceService } from "../../services/serviceService";
import type {
  Service,
  ServiceCategory,
  ServiceSubcategory,
  ServicePackage,
} from "../../types/service";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Modal } from "../../components/ui/Modal";
import { CustomSelect } from "../../components/ui/CustomSelect";
import {
  Wrench,
  Plus,
  CheckCircle,
  Layers,
  Package,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";

export const ServicesPage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ServiceSubcategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Hierarchy Selection
  const [selectedCatId, setSelectedCatId] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<
    "SERVICES" | "PACKAGES" | "SUBCATEGORIES"
  >("SERVICES");

  // Modals
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [isNewPackageOpen, setIsNewPackageOpen] = useState(false);
  const [isNewSubcatOpen, setIsNewSubcatOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  // Form State - Service
  const [newServiceName, setNewServiceName] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newSubcatId, setNewSubcatId] = useState("");
  const [newBasePrice, setNewBasePrice] = useState(499);
  const [newDuration, setNewDuration] = useState(45);
  const [newDesc, setNewDesc] = useState("");

  // Form State - Package
  const [pkgServiceId, setPkgServiceId] = useState("");
  const [pkgName, setPkgName] = useState("");
  const [pkgPrice, setPkgPrice] = useState(699);
  const [pkgDuration, setPkgDuration] = useState(60);
  const [pkgWarranty, setPkgWarranty] = useState(30);
  const [pkgInclusions, setPkgInclusions] = useState("");
  const [pkgDesc, setPkgDesc] = useState("");

  // Form State - Subcategory
  const [subcatCatId, setSubcatCatId] = useState("");
  const [subcatName, setSubcatName] = useState("");
  const [subcatDesc, setSubcatDesc] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, subcats, srvs, pkgs] = await Promise.all([
        serviceService.getCategories(),
        serviceService.getSubcategories(),
        serviceService.getServices(),
        serviceService.getPackages(),
      ]);
      setCategories(cats);
      setSubcategories(subcats);
      setServices(srvs);
      setPackages(pkgs);
      if (cats.length > 0 && !newCategoryId) {
        setNewCategoryId(cats[0].id);
        setSubcatCatId(cats[0].id);
      }
      if (srvs.length > 0 && !pkgServiceId) {
        setPkgServiceId(srvs[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    try {
      await serviceService.createService({
        name: newServiceName,
        categoryId: newCategoryId,
        subcategoryId: newSubcatId || undefined,
        basePrice: Number(newBasePrice),
        duration: Number(newDuration),
        description: newDesc,
        status: "ACTIVE",
      });

      setActionSuccess(`Service "${newServiceName}" added to catalogue.`);
      setIsNewServiceOpen(false);
      setNewServiceName("");
      setNewDesc("");
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create service");
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim() || !pkgServiceId) return;

    try {
      await serviceService.createPackage({
        serviceId: pkgServiceId,
        name: pkgName,
        description: pkgDesc,
        basePrice: Number(pkgPrice),
        duration: Number(pkgDuration),
        warrantyDays: Number(pkgWarranty),
        inclusions: pkgInclusions
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        status: "ACTIVE",
      });

      setActionSuccess(`Package "${pkgName}" added successfully.`);
      setIsNewPackageOpen(false);
      setPkgName("");
      setPkgInclusions("");
      setPkgDesc("");
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create package");
    }
  };

  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcatName.trim() || !subcatCatId) return;

    try {
      await serviceService.createSubcategory({
        categoryId: subcatCatId,
        name: subcatName,
        description: subcatDesc,
        status: "ACTIVE",
      });

      setActionSuccess(`Subcategory "${subcatName}" created.`);
      setIsNewSubcatOpen(false);
      setSubcatName("");
      setSubcatDesc("");
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Failed to create subcategory",
      );
    }
  };

  // Filtered lists based on category selection
  const filteredServices =
    selectedCatId === "ALL"
      ? services
      : services.filter((s) => s.categoryId === selectedCatId);

  const filteredSubcats =
    selectedCatId === "ALL"
      ? subcategories
      : subcategories.filter((s) => s.categoryId === selectedCatId);

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const subcategoryOptions = [
    { label: "None / General", value: "" },
    ...subcategories.map((sc) => ({
      label: `${sc.name} (${sc.categoryName})`,
      value: sc.id,
    })),
  ];

  const serviceOptions = services.map((s) => ({
    label: `${s.name} (${s.categoryName})`,
    value: s.id,
  }));

  const serviceColumns: Column<Service>[] = [
    {
      header: "Service & Code",
      accessor: (s) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">{s.name}</span>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
            <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">
              {s.id}
            </span>
            {s.subcategoryName && (
              <>
                <span>•</span>
                <span className="text-slate-600 font-medium">
                  {s.subcategoryName}
                </span>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (s) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
          {s.categoryName}
        </span>
      ),
    },
    {
      header: "Base Price",
      accessor: (s) => (
        <span className="font-bold text-xs text-slate-900">
          ₹{s.basePrice.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Duration",
      accessor: (s) => (
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {s.duration} mins
        </span>
      ),
    },
    {
      header: "Packages Tier",
      accessor: (s) => {
        const pkgCount = packages.filter((p) => p.serviceId === s.id).length;
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Package className="w-3 h-3" />
            {pkgCount} Packages
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: (s) => <StatusBadge status={s.status} />,
    },
  ];

  const packageColumns: Column<ServicePackage>[] = [
    {
      header: "Package Name",
      accessor: (p) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">{p.name}</span>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {p.id}
          </div>
        </div>
      ),
    },
    {
      header: "Parent Service",
      accessor: (p) => (
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
          {p.serviceName}
        </span>
      ),
    },
    {
      header: "Price & Duration",
      accessor: (p) => (
        <div className="text-xs">
          <div className="font-bold text-slate-900">
            ₹{p.basePrice.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">{p.duration} mins</div>
        </div>
      ),
    },
    {
      header: "Warranty",
      accessor: (p) => (
        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-600" />
          {p.warrantyDays} Days
        </span>
      ),
    },
    {
      header: "Inclusions",
      accessor: (p) => (
        <div className="text-[11px] text-slate-600 max-w-xs">
          {p.inclusions.slice(0, 2).map((inc, i) => (
            <div key={i} className="truncate">
              • {inc}
            </div>
          ))}
          {p.inclusions.length > 2 && (
            <div className="text-[10px] text-slate-400 font-medium">
              +{p.inclusions.length - 2} more inclusions
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (p) => <StatusBadge status={p.status} />,
    },
  ];

  const subcategoryColumns: Column<ServiceSubcategory>[] = [
    {
      header: "Subcategory",
      accessor: (sc) => (
        <div>
          <div className="font-bold text-slate-900 text-xs">{sc.name}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {sc.description}
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (sc) => (
        <span className="font-semibold text-xs text-slate-700">
          {sc.categoryName}
        </span>
      ),
    },
    {
      header: "Services Count",
      accessor: (sc) => (
        <span className="font-semibold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
          {sc.serviceCount} Services
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (sc) => <StatusBadge status={sc.status} />,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            <span>Service Catalogue Management (4-Tier Hierarchy)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
            <span>Configure Categories</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span>Subcategories</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span>Services</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span>
              Detailed Packages with pricing, warranty, and inclusions.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsNewSubcatOpen(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subcategory</span>
          </button>
          <button
            onClick={() => setIsNewServiceOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
          <button
            onClick={() => setIsNewPackageOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Add Package</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Category Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => setSelectedCatId("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            selectedCatId === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          All Categories ({services.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCatId === cat.id
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {cat.name} ({cat.serviceCount})
          </button>
        ))}
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("SERVICES")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "SERVICES"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Services Tier ({filteredServices.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("PACKAGES")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "PACKAGES"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Granular Packages Tier ({packages.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("SUBCATEGORIES")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "SUBCATEGORIES"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Subcategories Tier ({filteredSubcats.length})</span>
        </button>
      </div>

      {/* Tables based on active tab */}
      {activeTab === "SERVICES" && (
        <DataTable
          data={filteredServices}
          columns={serviceColumns}
          keyExtractor={(s) => s.id}
          isLoading={isLoading}
          emptyMessage="No services found in this category."
        />
      )}

      {activeTab === "PACKAGES" && (
        <DataTable
          data={packages}
          columns={packageColumns}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          emptyMessage="No service packages defined."
        />
      )}

      {activeTab === "SUBCATEGORIES" && (
        <DataTable
          data={filteredSubcats}
          columns={subcategoryColumns}
          keyExtractor={(sc) => sc.id}
          isLoading={isLoading}
          emptyMessage="No subcategories created."
        />
      )}

      {/* New Service Modal */}
      <Modal
        isOpen={isNewServiceOpen}
        onClose={() => setIsNewServiceOpen(false)}
        title="Add New Service to Catalogue"
        maxWidth="md"
      >
        <form onSubmit={handleCreateService} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="e.g. AC Gas Refill & Valve Check"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <CustomSelect
                label="Parent Category *"
                options={categoryOptions}
                value={newCategoryId}
                onChange={(val) => setNewCategoryId(val)}
              />
            </div>
            <div>
              <CustomSelect
                label="Subcategory"
                options={subcategoryOptions}
                value={newSubcatId}
                onChange={(val) => setNewSubcatId(val)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Base Price (₹) *
              </label>
              <input
                type="number"
                required
                value={newBasePrice}
                onChange={(e) => setNewBasePrice(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Duration (Mins) *
              </label>
              <input
                type="number"
                required
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Service Description
            </label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What does this service entail?"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewServiceOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors"
            >
              Create Service
            </button>
          </div>
        </form>
      </Modal>

      {/* New Package Modal */}
      <Modal
        isOpen={isNewPackageOpen}
        onClose={() => setIsNewPackageOpen(false)}
        title="Add Granular Service Package (Tier 4)"
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePackage} className="space-y-3.5 text-xs">
          <div>
            <CustomSelect
              label="Parent Service *"
              options={serviceOptions}
              value={pkgServiceId}
              onChange={(val) => setPkgServiceId(val)}
              searchable={true}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Package Name *
            </label>
            <input
              type="text"
              required
              value={pkgName}
              onChange={(e) => setPkgName(e.target.value)}
              placeholder="e.g. AC Deep Jet Foam Wash + Outdoor Unit"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                value={pkgPrice}
                onChange={(e) => setPkgPrice(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                value={pkgDuration}
                onChange={(e) => setPkgDuration(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Warranty (Days)
              </label>
              <input
                type="number"
                value={pkgWarranty}
                onChange={(e) => setPkgWarranty(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Package Inclusions (One per line) *
            </label>
            <textarea
              rows={3}
              required
              value={pkgInclusions}
              onChange={(e) => setPkgInclusions(e.target.value)}
              placeholder="Indoor coil jet foam wash&#10;Outdoor unit pressure clean&#10;Drain pipe cleaning"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewPackageOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
            >
              Create Package
            </button>
          </div>
        </form>
      </Modal>

      {/* New Subcategory Modal */}
      <Modal
        isOpen={isNewSubcatOpen}
        onClose={() => setIsNewSubcatOpen(false)}
        title="Add Subcategory (Tier 2)"
        maxWidth="md"
      >
        <form
          onSubmit={handleCreateSubcategory}
          className="space-y-3.5 text-xs"
        >
          <div>
            <CustomSelect
              label="Parent Category *"
              options={categoryOptions}
              value={subcatCatId}
              onChange={(val) => setSubcatCatId(val)}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Subcategory Name *
            </label>
            <input
              type="text"
              required
              value={subcatName}
              onChange={(e) => setSubcatName(e.target.value)}
              placeholder="e.g. Air Conditioner Services"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={subcatDesc}
              onChange={(e) => setSubcatDesc(e.target.value)}
              placeholder="Description of this subcategory..."
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewSubcatOpen(false)}
              className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold bg-slate-900 hover:bg-black text-white rounded-lg shadow-xs transition-colors"
            >
              Create Subcategory
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
