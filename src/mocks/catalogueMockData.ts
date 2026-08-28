import type { ServiceSubcategory, ServicePackage } from "../types/service";

export const INITIAL_SUBCATEGORIES: ServiceSubcategory[] = [
  {
    id: "SUBCAT-001",
    categoryId: "CAT-001", // AC & Appliance
    categoryName: "AC & Appliance Repair",
    name: "Air Conditioner Services",
    description: "Split, Window, Cassette, and Commercial VRF AC services",
    status: "ACTIVE",
    serviceCount: 4,
    createdAt: "2026-08-01",
  },
  {
    id: "SUBCAT-002",
    categoryId: "CAT-001",
    categoryName: "AC & Appliance Repair",
    name: "Washing Machine & Refrigerator",
    description: "Front load, top load, inverter refrigerators, and microwaves",
    status: "ACTIVE",
    serviceCount: 3,
    createdAt: "2026-08-01",
  },
  {
    id: "SUBCAT-003",
    categoryId: "CAT-002", // Plumbing
    categoryName: "Plumbing Services",
    name: "Taps, Mixers & Pipe Fittings",
    description: "Leak fixes, CPVC pipe replacements, diverters, and overhead tanks",
    status: "ACTIVE",
    serviceCount: 3,
    createdAt: "2026-08-01",
  },
  {
    id: "SUBCAT-004",
    categoryId: "CAT-003", // Cleaning
    categoryName: "Home Cleaning & Pest Control",
    name: "Full Home & Deep Jet Cleaning",
    description: "1BHK to 5BHK deep cleaning, floor scrubbing, and balcony wash",
    status: "ACTIVE",
    serviceCount: 4,
    createdAt: "2026-08-01",
  },
  {
    id: "SUBCAT-005",
    categoryId: "CAT-004", // Electrical
    categoryName: "Electrical & Wiring",
    name: "Switchboards, Fans & Lighting",
    description: "Modular switchboard replacement, fan rewiring, chandelier and LED installation",
    status: "ACTIVE",
    serviceCount: 3,
    createdAt: "2026-08-01",
  },
];

export const INITIAL_PACKAGES: ServicePackage[] = [
  {
    id: "PKG-001",
    serviceId: "SRV-001", // AC Service
    serviceName: "AC Foam Jet Service",
    name: "Standard AC Deep Foam Service",
    description: "Comprehensive 2-in-1 indoor and outdoor unit jet foam deep wash.",
    basePrice: 599,
    duration: 45,
    inclusions: [
      "Indoor cooling coil jet foam wash",
      "Outdoor condenser unit high-pressure wash",
      "Drain tray & pipe cleaning to prevent leakage",
      "Gas pressure & cooling temperature audit",
    ],
    exclusions: ["Refrigerant gas refill", "Copper pipe replacement", "PCB board repair"],
    warrantyDays: 30,
    materialsIncluded: ["Eco-friendly antibacterial foam cleaner", "Protective indoor jacket"],
    status: "ACTIVE",
    createdAt: "2026-08-05",
  },
  {
    id: "PKG-002",
    serviceId: "SRV-001",
    serviceName: "AC Foam Jet Service",
    name: "AC Service + Complete Gas Charging (R32 / R410A)",
    description: "Jet wash service combined with 100% full cylinder refrigerant top-up and leak test.",
    basePrice: 2299,
    duration: 75,
    inclusions: [
      "Full foam jet cleaning of indoor and outdoor units",
      "Nitrogen leak pressure testing",
      "Complete vacuuming and 100% genuine refrigerant refill",
      "Amperage and cooling efficiency calibration",
    ],
    exclusions: ["Compressor replacement"],
    warrantyDays: 60,
    materialsIncluded: ["Genuine R32/R410A gas", "Leak test solution", "Foam spray"],
    status: "ACTIVE",
    createdAt: "2026-08-05",
  },
  {
    id: "PKG-003",
    serviceId: "SRV-002", // Plumbing
    serviceName: "Plumbing Inspection & Minor Repair",
    name: "Express Leak Fix & Tap Replacement Package",
    description: "Diagnostic visit and repair/replacement of up to 2 taps or shower mixers.",
    basePrice: 299,
    duration: 30,
    inclusions: [
      "Inspection of all bathroom faucets and pipelines",
      "Replacement of washer/spindle or installation of 2 customer-supplied taps",
      "Teflon tape sealing and water pressure check",
    ],
    exclusions: ["Cost of new taps/mixers (materials extra if supplied by partner)"],
    warrantyDays: 15,
    materialsIncluded: ["Teflon sealing tape", "Rubber gaskets"],
    status: "ACTIVE",
    createdAt: "2026-08-05",
  },
  {
    id: "PKG-004",
    serviceId: "SRV-003", // Deep Cleaning
    serviceName: "Full Home Deep Cleaning (2BHK)",
    name: "Premium 2BHK Deep Cleaning with Machine Scrubbing",
    description: "Complete apartment deep scrubbing using industrial single-disc machines and chemicals.",
    basePrice: 3499,
    duration: 240,
    inclusions: [
      "Floor scrubbing of living, bedrooms, and kitchen",
      "Complete bathroom descaling and tile scrubbing",
      "Kitchen chimney and countertop degreasing",
      "Balcony high-pressure jet wash",
      "Window glass cleaning and fan dusting",
    ],
    exclusions: ["Sofa shampooing (available as add-on)"],
    warrantyDays: 7,
    materialsIncluded: ["Diversey chemicals", "Single-disc scrubber machine", "Microfiber cloths"],
    status: "ACTIVE",
    createdAt: "2026-08-05",
  },
];
