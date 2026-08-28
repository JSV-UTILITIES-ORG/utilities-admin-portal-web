export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "ACTIVE" | "INACTIVE";
  serviceCount: number;
  subcategoriesCount?: number;
  createdAt: string;
}

export interface ServiceSubcategory {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  serviceCount: number;
  createdAt: string;
}

export interface ServicePackage {
  id: string;
  serviceId: string;
  serviceName: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number; // in minutes
  inclusions: string[];
  exclusions?: string[];
  warrantyDays: number;
  materialsIncluded?: string[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface Service {
  id: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number; // in minutes
  packagesCount?: number;
  packages?: ServicePackage[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}
