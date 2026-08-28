import { useAuth } from "../features/auth/AuthContext";
import type { Permission } from "../types/admin";
import { ROLE_PERMISSIONS } from "./roles";

export function usePermissions() {
  const { admin } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!admin) return false;
    // Super admin has full access to all modules
    if (admin.role === "SUPER_ADMIN") return true;

    // Check active permissions on user object or fallback to role definition
    if (admin.permissions && admin.permissions.includes(permission)) return true;
    if (admin.role && ROLE_PERMISSIONS[admin.role]?.includes(permission)) return true;

    return false;
  };

  const hasAnyPermission = (...permissions: Permission[]): boolean => {
    return permissions.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (...permissions: Permission[]): boolean => {
    return permissions.every((p) => hasPermission(p));
  };

  return { hasPermission, hasAnyPermission, hasAllPermissions };
}
