/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        elevated: "#FCFCFD",
        foreground: "#18181B",
        muted: "#71717A",
        border: "rgba(24, 24, 27, 0.08)",
        navy: {
          900: "#111827",
          800: "#1F2937",
          700: "#374151",
        },
        emerald: {
          700: "#2F6F5E",
          600: "#3F7F6D",
          100: "#E9F3EF",
        },
        amber: {
          700: "#8A623A",
          100: "#F6EFE5",
        },
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.08)",
        card: "0 8px 24px rgba(17, 24, 39, 0.06)",
        hover: "0 14px 34px rgba(17, 24, 39, 0.10)",
      },
      fontFamily: {
        sans: ["Inter", "Geist", "Söhne", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      maxWidth: {
        site: "1280px",
      },
    },
  },
};

export default config;
