/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1B2A4A",
        teal: "#0EA5C4",
        amber: "#F59E0B",
        "text-main": "#1E293B",
        "text-sub": "#475569",
        border: "#E2E8F0",
      },
    },
  },
  plugins: [],
};
