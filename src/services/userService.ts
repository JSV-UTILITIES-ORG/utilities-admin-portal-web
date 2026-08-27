import { mockStore } from "./mockStore";
import type { Customer } from "../types/customer";

export const userService = {
  async getUsers(search?: string, status?: string): Promise<Customer[]> {
    await new Promise((r) => setTimeout(r, 100));
    let list = [...mockStore.customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.mobile.includes(q) ||
          (u.email && u.email.toLowerCase().includes(q)),
      );
    }
    if (status && status !== "ALL") {
      list = list.filter((u) => u.status === status);
    }
    return list;
  },

  async getUserById(id: string): Promise<Customer | null> {
    await new Promise((r) => setTimeout(r, 100));
    return mockStore.customers.find((u) => u.id === id) || null;
  },

  async updateUserStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED",
    reason: string,
    adminName: string,
  ): Promise<Customer> {
    await new Promise((r) => setTimeout(r, 150));
    const user = mockStore.customers.find((u) => u.id === id);
    if (!user) throw new Error("Customer not found");

    const prevStatus = user.status;
    user.status = status;

    mockStore.addAuditLog({
      adminId: "CURRENT_ADMIN",
      adminName,
      action: `USER_STATUS_${status}`,
      entity: "Customer",
      entityId: id,
      previousValue: prevStatus,
      newValue: status,
      reason,
      ipAddress: "127.0.0.1",
    });

    return { ...user };
  },
};
