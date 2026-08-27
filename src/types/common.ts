export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type SLAStatus = "OK" | "WARNING" | "BREACHED";

export interface SLAInfo {
  limitMinutes: number;
  elapsedMinutes: number;
  status: SLAStatus;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface DateRange {
  from: string;
  to: string;
}
