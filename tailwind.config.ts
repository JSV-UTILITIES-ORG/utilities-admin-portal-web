import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8", // example global color
        secondary: "#9333ea",
      },
      spacing: {
        "128": "32rem", // example global spacing
      },
    },
  },
  plugins: [],
} satisfies Config;
