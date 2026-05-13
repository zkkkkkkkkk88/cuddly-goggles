import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#1c1917",
          700: "#44403c",
          500: "#78716c",
          400: "#a8a29e",
          300: "#d6d3d1",
          200: "#e7e5e4",
          100: "#f5f5f4",
        },
        paper: "#faf9f7",
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
        },
        green: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        red: {
          50: "#fef2f2",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
      },
      animation: {
        "enter": "enter 0.4s ease-out both",
      },
      keyframes: {
        enter: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      fontFamily: {
        heading: ['"Noto Serif SC"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
