/**
 * PaniMitra Design System & Color Tokens
 * Centralized color palette, typography definitions, and semantic styles.
 */

export const THEME_COLORS = {
  // Backgrounds & Surfaces
  background: "#f8fafc", // Light slate canvas (Tailwind slate-50)
  surface: "#ffffff", // Crisp white card container
  surfaceSubtle: "#f1f5f9", // Slate-100 table headers / inputs

  // Primary Brands & Typography
  primary: "#0f172a", // Dark navy/black (buttons, headings, active pills)
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
  border: "#e2e8f0", // Subtle 1px borders (slate-200)

  // Accent & Action
  accentBlue: "#2563eb", // Direct links, icons, primary highlights

  // Semantic Alert & Severity Badges
  critical: {
    bg: "#fef2f2", // red-50
    text: "#b91c1c", // red-700
    border: "#fecaca", // red-200
    solid: "#ef4444", // red-500
  },
  high: {
    bg: "#fffbeb", // amber-50
    text: "#92400e", // amber-800
    border: "#fde68a", // amber-200
    solid: "#f59e0b", // amber-500
  },
  inReview: {
    bg: "#eff6ff", // blue-50
    text: "#1d4ed8", // blue-700
    border: "#bfdbfe", // blue-200
    solid: "#3b82f6", // blue-500
  },
  success: {
    bg: "#ecfdf5", // emerald-50
    text: "#047857", // emerald-700
    border: "#a7f3d0", // emerald-200
    solid: "#10b981", // emerald-500
  },

  // Chart Palettes
  charts: {
    blue: "#2563eb",
    emerald: "#10b981",
    navy: "#0f172a",
    amber: "#f59e0b",
    purple: "#8b5cf6",
    slate: "#64748b",
  },
} as const;

export const TYPOGRAPHY = {
  heading: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
  sans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;
