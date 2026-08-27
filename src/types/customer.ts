export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  totalBookings: number;
  totalSpend: number;
  createdAt: string;
  lastActivity: string;
  address?: string;
  city?: string;
}
