export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  ipAddress: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
  category:
    | "ASSIGNMENT"
    | "PAYMENT"
    | "VERIFICATION"
    | "DISPUTE"
    | "SUPPORT"
    | "SYSTEM";
  link?: string;
  read: boolean;
  createdAt: string;
}
