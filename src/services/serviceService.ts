import { mockStore } from "./mockStore";
import type {
  Service,
  ServiceCategory,
  ServiceSubcategory,
  ServicePackage,
} from "../types/service";

export const serviceService = {
  // Categories
  async getCategories(): Promise<ServiceCategory[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [...mockStore.categories];
  },

  async createCategory(data: Omit<ServiceCategory, "id" | "serviceCount" | "createdAt">): Promise<ServiceCategory> {
    await new Promise((r) => setTimeout(r, 100));
    const newCat: ServiceCategory = {
      ...data,
      id: `CAT-${Date.now().toString().slice(-4)}`,
      serviceCount: 0,
      subcategoriesCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    mockStore.categories.push(newCat);
    return newCat;
  },

  // Subcategories (Tier 2)
  async getSubcategories(categoryId?: string): Promise<ServiceSubcategory[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (categoryId) {
      return mockStore.subcategories.filter((s) => s.categoryId === categoryId);
    }
    return [...mockStore.subcategories];
  },

  async createSubcategory(
    data: { categoryId: string; name: string; description: string; status: "ACTIVE" | "INACTIVE" }
  ): Promise<ServiceSubcategory> {
    await new Promise((r) => setTimeout(r, 100));
    const cat = mockStore.categories.find((c) => c.id === data.categoryId);
    const newSub: ServiceSubcategory = {
      ...data,
      categoryName: cat?.name || "General",
      id: `SUBCAT-${Date.now().toString().slice(-4)}`,
      serviceCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    mockStore.subcategories.push(newSub);
    if (cat) {
      cat.subcategoriesCount = (cat.subcategoriesCount || 0) + 1;
    }
    return newSub;
  },

  // Services (Tier 3)
  async getServices(categoryId?: string, subcategoryId?: string): Promise<Service[]> {
    await new Promise((r) => setTimeout(r, 60));
    let list = [...mockStore.services];
    if (categoryId) {
      list = list.filter((s) => s.categoryId === categoryId);
    }
    if (subcategoryId) {
      list = list.filter((s) => s.subcategoryId === subcategoryId);
    }
    return list;
  },

  async createService(
    data: Omit<Service, "id" | "categoryName" | "createdAt">
  ): Promise<Service> {
    await new Promise((r) => setTimeout(r, 100));
    const category = mockStore.categories.find((c) => c.id === data.categoryId);
    const subcat = mockStore.subcategories.find((s) => s.id === data.subcategoryId);

    const newService: Service = {
      ...data,
      id: `SRV-${Date.now().toString().slice(-4)}`,
      categoryName: category?.name || "General",
      subcategoryName: subcat?.name,
      packagesCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    mockStore.services.push(newService);
    if (category) category.serviceCount += 1;
    if (subcat) subcat.serviceCount += 1;

    return newService;
  },

  // Packages (Tier 4)
  async getPackages(serviceId?: string): Promise<ServicePackage[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (serviceId) {
      return mockStore.packages.filter((p) => p.serviceId === serviceId);
    }
    return [...mockStore.packages];
  },

  async createPackage(
    data: Omit<ServicePackage, "id" | "createdAt" | "serviceName">
  ): Promise<ServicePackage> {
    await new Promise((r) => setTimeout(r, 100));
    const srv = mockStore.services.find((s) => s.id === data.serviceId);
    const newPkg: ServicePackage = {
      ...data,
      serviceName: srv?.name || "Service",
      id: `PKG-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    mockStore.packages.push(newPkg);
    if (srv) {
      srv.packagesCount = (srv.packagesCount || 0) + 1;
    }
    return newPkg;
  },
};
