import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { AppShell } from "../../components/layout/AppShell";
import { LoginPage } from "../../features/auth/LoginPage";
import { DashboardPage } from "../../features/dashboard/DashboardPage";
import { BookingsPage } from "../../features/bookings/BookingsPage";
import { BookingDetailPage } from "../../features/bookings/BookingDetailPage";
import { AssignmentsPage } from "../../features/assignments/AssignmentsPage";
import { PartnersPage } from "../../features/partners/PartnersPage";
import { PartnerDetailPage } from "../../features/partners/PartnerDetailPage";
import { VerificationPage } from "../../features/verification/VerificationPage";
import { UsersPage } from "../../features/users/UsersPage";
import { UserDetailPage } from "../../features/users/UserDetailPage";
import { ServicesPage } from "../../features/services/ServicesPage";
import { JobsPage } from "../../features/jobs/JobsPage";
import { JobDetailPage } from "../../features/jobs/JobDetailPage";
import { AccommodationsPage } from "../../features/accommodations/AccommodationsPage";
import { AccommodationDetailPage } from "../../features/accommodations/AccommodationDetailPage";
import { PaymentsPage } from "../../features/payments/PaymentsPage";
import { RefundsPage } from "../../features/refunds/RefundsPage";
import { FinancePage } from "../../features/finance/FinancePage";
import { SupportPage } from "../../features/support/SupportPage";
import { DisputesPage } from "../../features/disputes/DisputesPage";
import { ReportsPage } from "../../features/reports/ReportsPage";
import { RolesPage } from "../../features/roles/RolesPage";
import { AuditLogsPage } from "../../features/audit/AuditLogsPage";
import { SettingsPage } from "../../features/settings/SettingsPage";
import { ProfilePage } from "../../features/profile/ProfilePage";
import { usePermissions } from "../../permissions/usePermissions";
import type { Permission } from "../../types/admin";

// Protected route guard
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  permission?: Permission;
}> = ({ children, permission }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermissions();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-red-600">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1">
          Your active admin role does not possess the required `{permission}` permission.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Bookings & Assignments (Service Marketplace) */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute permission="bookings.view">
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <ProtectedRoute permission="bookings.view">
              <BookingDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute permission="assignments.view">
              <AssignmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Work Marketplace (Partner-Created Jobs) */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute permission="jobs.view">
              <JobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute permission="jobs.view">
              <JobDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Accommodation Marketplace (PG / Stays) */}
        <Route
          path="/accommodations"
          element={
            <ProtectedRoute permission="accommodations.view">
              <AccommodationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accommodations/:id"
          element={
            <ProtectedRoute permission="accommodations.view">
              <AccommodationDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Partners & Real-Time Verification */}
        <Route
          path="/partners"
          element={
            <ProtectedRoute permission="partners.view">
              <PartnersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners/:id"
          element={
            <ProtectedRoute permission="partners.view">
              <PartnerDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verification"
          element={
            <ProtectedRoute permission="verification.view">
              <VerificationPage />
            </ProtectedRoute>
          }
        />

        {/* Customers / Users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute permission="users.view">
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute permission="users.view">
              <UserDetailPage />
            </ProtectedRoute>
          }
        />

        {/* 4-Tier Service Catalogue */}
        <Route
          path="/services"
          element={
            <ProtectedRoute permission="services.view">
              <ServicesPage />
            </ProtectedRoute>
          }
        />

        {/* Multi-Marketplace Finance & Settlements */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute permission="payments.view">
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refunds"
          element={
            <ProtectedRoute permission="refunds.view">
              <RefundsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <ProtectedRoute permission="finance.view">
              <FinancePage />
            </ProtectedRoute>
          }
        />

        {/* Customer Operations & Quality */}
        <Route
          path="/support"
          element={
            <ProtectedRoute permission="support.view">
              <SupportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disputes"
          element={
            <ProtectedRoute permission="disputes.view">
              <DisputesPage />
            </ProtectedRoute>
          }
        />

        {/* Analytics */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute permission="reports.view">
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Administration */}
        <Route
          path="/roles"
          element={
            <ProtectedRoute permission="roles.view">
              <RolesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute permission="audit.view">
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute permission="settings.manage">
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
