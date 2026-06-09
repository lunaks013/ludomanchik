/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1e293b",
        "navy-light": "#334155",
        accent: "#3b82f6",
        "accent-light": "#93c5fd",
        gold: "#3b82f6",
        ozon: {
          blue: "#1e40af",
          pink: "#dc2626",
          bg: "#f1f5f9",
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
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(15, 23, 42, 0.08)",
        lift: "0 12px 40px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
