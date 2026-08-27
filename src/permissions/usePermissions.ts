import { useAuth } from "../features/auth/AuthContext";
import type { Permission } from "../types/admin";

export function usePermissions() {
  const { admin } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!admin) return false;
    return admin.permissions.includes(permission);
  };

  const hasAnyPermission = (...permissions: Permission[]): boolean => {
    return permissions.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (...permissions: Permission[]): boolean => {
    return permissions.every((p) => hasPermission(p));
  };

  return { hasPermission, hasAnyPermission, hasAllPermissions };
}
