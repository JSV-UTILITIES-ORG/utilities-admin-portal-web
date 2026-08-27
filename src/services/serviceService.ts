import { mockStore } from "./mockStore";
import type { Service, ServiceCategory } from "../types/service";

export const serviceService = {
  async getCategories(): Promise<ServiceCategory[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...mockStore.categories];
  },

  async getServices(categoryId?: string): Promise<Service[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!categoryId || categoryId === "ALL") {
      return [...mockStore.services];
    }
    return mockStore.services.filter((s) => s.categoryId === categoryId);
  },

  async createService(
    newService: Omit<Service, "id" | "createdAt">,
    adminName: string,
  ): Promise<Service> {
    await new Promise((r) => setTimeout(r, 150));
    const created: Service = {
      ...newService,
      id: `SRV-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    mockStore.services.push(created);

    // Increment category count
    const cat = mockStore.categories.find(
      (c) => c.id === newService.categoryId,
    );
    if (cat) cat.serviceCount += 1;

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "SERVICE_CREATED",
      entity: "Service",
      entityId: created.id,
      newValue: created.name,
      reason: "New catalog item introduced",
      ipAddress: "127.0.0.1",
    });

    return created;
  },

  async toggleServiceStatus(id: string, adminName: string): Promise<Service> {
    await new Promise((r) => setTimeout(r, 150));
    const service = mockStore.services.find((s) => s.id === id);
    if (!service) throw new Error("Service not found");

    const prev = service.status;
    service.status = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: "SERVICE_STATUS_TOGGLED",
      entity: "Service",
      entityId: id,
      previousValue: prev,
      newValue: service.status,
      ipAddress: "127.0.0.1",
    });

    return { ...service };
  },
};
