export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "ACTIVE" | "INACTIVE";
  serviceCount: number;
  createdAt: string;
}

export interface Service {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number; // in minutes
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}
