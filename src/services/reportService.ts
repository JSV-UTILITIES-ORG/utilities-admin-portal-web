export interface AnalyticsTrendPoint {
  date: string;
  bookings: number;
  revenue: number;
  completed: number;
  cancelled: number;
}

export interface ServiceSharePoint {
  name: string;
  value: number;
  revenue: number;
}

export interface CityFulfillmentPoint {
  city: string;
  bookings: number;
  completed: number;
  activePartners: number;
}

export interface SharePiePoint {
  name: string;
  value: number;
  color: string;
}

export const reportService = {
  async getDailyTrends(): Promise<AnalyticsTrendPoint[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [
      {
        date: "Aug 21",
        bookings: 142,
        revenue: 98000,
        completed: 130,
        cancelled: 4,
      },
      {
        date: "Aug 22",
        bookings: 156,
        revenue: 112000,
        completed: 148,
        cancelled: 5,
      },
      {
        date: "Aug 23",
        bookings: 189,
        revenue: 145000,
        completed: 175,
        cancelled: 6,
      },
      {
        date: "Aug 24",
        bookings: 174,
        revenue: 128000,
        completed: 160,
        cancelled: 7,
      },
      {
        date: "Aug 25",
        bookings: 165,
        revenue: 119000,
        completed: 155,
        cancelled: 3,
      },
      {
        date: "Aug 26",
        bookings: 198,
        revenue: 162000,
        completed: 184,
        cancelled: 5,
      },
      {
        date: "Aug 27",
        bookings: 224,
        revenue: 184500,
        completed: 202,
        cancelled: 4,
      },
    ];
  },

  async getServiceCategoryDistribution(): Promise<ServiceSharePoint[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [
      { name: "AC & Cooling", value: 42, revenue: 385000 },
      { name: "Plumbing & Water", value: 24, revenue: 164000 },
      { name: "Electrical & Wiring", value: 18, revenue: 122000 },
      { name: "Deep Cleaning", value: 10, revenue: 118000 },
      { name: "Appliance Repair", value: 6, revenue: 53500 },
    ];
  },

  async getCityZoneFulfillment(): Promise<CityFulfillmentPoint[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [
      { city: "Bengaluru", bookings: 420, completed: 395, activePartners: 18 },
      { city: "Pune", bookings: 280, completed: 260, activePartners: 12 },
      { city: "Mumbai", bookings: 310, completed: 290, activePartners: 14 },
      { city: "Chennai", bookings: 190, completed: 178, activePartners: 8 },
      { city: "Gurugram", bookings: 150, completed: 140, activePartners: 6 },
    ];
  },

  async getPaymentMethodShare(): Promise<SharePiePoint[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [
      { name: "UPI / QR", value: 64, color: "#3b82f6" },
      { name: "Credit/Debit Card", value: 22, color: "#10b981" },
      { name: "Netbanking", value: 9, color: "#f59e0b" },
      { name: "Cash on Delivery", value: 5, color: "#64748b" },
    ];
  },

  async getDisputeCategoryShare(): Promise<SharePiePoint[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [
      { name: "Service Quality", value: 40, color: "#ef4444" },
      { name: "Technician Delay", value: 30, color: "#f59e0b" },
      { name: "Billing / Overcharge", value: 20, color: "#3b82f6" },
      { name: "Partner Misbehaviour", value: 10, color: "#8b5cf6" },
    ];
  },
};
