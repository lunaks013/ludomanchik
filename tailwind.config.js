/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1e293b",
        "navy-light": "#334155",
        accent: "#2563eb",
        "accent-hover": "#1d4ed8",
        gold: "#2563eb",
        ozon: {
          blue: "#1e40af",
          pink: "#dc2626",
          bg: "#f8fafc",
          card: "#ffffff",
          text: "#0f172a",
          muted: "#64748b",
          border: "#e2e8f0",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "8px",
        btn: "6px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.06)",
        lift: "0 4px 12px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
