/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#CCB9AA",
        surface: "#FFFFFF",
        elevated: "#FFFFFF",
        foreground: "#2D1400",
        muted: "#8F7968",
        border: "rgba(45, 20, 0, 0.16)",
        navy: {
          900: "#2D1400",
          800: "#2D1400",
          700: "#8F7968",
        },
        emerald: {
          700: "#2D1400",
          600: "#8F7968",
          100: "#CCB9AA",
        },
        amber: {
          700: "#8F7968",
          100: "#CCB9AA",
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
        subtle: "0 1px 3px rgba(45, 20, 0, 0.08)",
        card: "0 8px 24px rgba(45, 20, 0, 0.10)",
        hover: "0 14px 34px rgba(45, 20, 0, 0.16)",
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
