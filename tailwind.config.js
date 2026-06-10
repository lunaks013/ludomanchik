/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        academic: {
          navy: "#1e3a5f",
          "navy-light": "#2d4a73",
          bg: "#f4f6f9",
          card: "#ffffff",
          border: "#e2e8f0",
          muted: "#64748b",
          text: "#1e293b",
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
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
