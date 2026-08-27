import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core Brand & Surface Colors
        brand: {
          bg: "#f8fafc", // Main app background (slate-50)
          surface: "#ffffff", // White card surface
          subtle: "#f1f5f9", // Light slate input/table headers (slate-100)
          primary: "#0f172a", // Dark navy active pills/buttons (slate-900)
          accent: "#2563eb", // Action blue (blue-600)
          border: "#e2e8f0", // Standard card borders (slate-200)
          muted: "#94a3b8", // Muted text (slate-400)
          secondary: "#64748b", // Secondary text (slate-500)
        },

        // Semantic Operational Alert Palettes
        status: {
          critical: {
            bg: "#fef2f2",
            text: "#b91c1c",
            border: "#fecaca",
            solid: "#ef4444",
          },
          high: {
            bg: "#fffbeb",
            text: "#92400e",
            border: "#fde68a",
            solid: "#f59e0b",
          },
          inReview: {
            bg: "#eff6ff",
            text: "#1d4ed8",
            border: "#bfdbfe",
            solid: "#3b82f6",
          },
          success: {
            bg: "#ecfdf5",
            text: "#047857",
            border: "#a7f3d0",
            solid: "#10b981",
          },
        },
      },

      fontFamily: {
        heading: [
          "Manrope",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        sans: [
          "IBM Plex Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }], // 10px
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
        "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
      },

      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },

      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        xs: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
} satisfies Config;
