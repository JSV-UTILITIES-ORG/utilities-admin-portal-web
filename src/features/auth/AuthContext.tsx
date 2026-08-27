import React, { createContext, useContext, useState, useEffect } from "react";
import type { Admin, AdminRole } from "../../types/admin";
import { authService } from "../../services/authService";

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: AdminRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      setAdmin(user);
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, pass);
      setAdmin(user);
      localStorage.setItem("cs_admin_user", JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("cs_admin_user");
  };

  const switchRole = async (role: AdminRole) => {
    setIsLoading(true);
    try {
      const user = await authService.switchRole(role);
      setAdmin(user);
      localStorage.setItem("cs_admin_user", JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
