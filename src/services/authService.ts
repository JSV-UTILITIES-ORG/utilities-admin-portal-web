import { mockStore } from "./mockStore";
import type { Admin, AdminRole } from "../types/admin";
import { ROLE_PERMISSIONS } from "../permissions/roles";

export const authService = {
  async login(email: string, _password: string): Promise<Admin> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const found = mockStore.admins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    );
    if (found) {
      return {
        ...found,
        lastLogin: new Date().toISOString().replace("T", " ").slice(0, 16),
      };
    }
    // Default to Super Admin if credentials don't match exact admin
    return {
      id: "ADM-001",
      name: email.split("@")[0] || "Admin User",
      email: email,
      role: "SUPER_ADMIN",
      permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
      status: "ACTIVE",
      lastLogin: new Date().toISOString().replace("T", " ").slice(0, 16),
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    };
  },

  async switchRole(role: AdminRole): Promise<Admin> {
    const admin = mockStore.admins.find((a) => a.role === role) || {
      id: `ADM-${role}`,
      name: `${role.replace("_", " ")} User`,
      email: `${role.toLowerCase()}@cityservices.io`,
      role,
      permissions: ROLE_PERMISSIONS[role],
      status: "ACTIVE",
      lastLogin: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    return admin;
  },

  async getCurrentUser(): Promise<Admin | null> {
    const stored = localStorage.getItem("cs_admin_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockStore.admins[0];
      }
    }
    return mockStore.admins[0];
  },
};
