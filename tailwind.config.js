/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0a1628",
        "navy-light": "#132238",
        gold: "#c9a227",
        "gold-hover": "#b08d1e",
        ozon: {
          blue: "#1e3a5f",
          pink: "#dc2626",
          bg: "#f0f2f6",
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
        card: "16px",
        btn: "10px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(10, 22, 40, 0.08)",
        lift: "0 12px 40px rgba(10, 22, 40, 0.12)",
      },
    },
  },
  plugins: [],
};
