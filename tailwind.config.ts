import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./backend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        zoo: {
          dark: "#0b0621",
          midnight: "#140c36",
          purple: "#7c3aed",
          yellow: "#ffcc00",
          yellowHover: "#ffd633",
          yellowShadow: "#cc9900",
          coral: "#ff5757",
          green: "#22c55e",
          cyan: "#00bcd4",
          blue: "#3b82f6",
        },
        night: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#140c36",
          950: "#0b0621",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Nunito", "sans-serif"],
        display: ["var(--font-display)", "Baloo 2", "cursive", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      animation: {
        float: "floatSlow 4s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
