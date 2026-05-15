import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deco: {
          cream: "#faf7f2",
          ivory: "#f5f0e8",
          navy: "#1a2744",
          ink: "#2d2d3f",
          brass: "#c8a951",
          gold: "#d4af37",
          copper: "#b87333",
          rose: "#c08081",
          sage: "#8aa79c",
          warmgray: "#8a857c",
          pearl: "#f0ebe0",
        },
      },
      animation: {
        "enter": "enter 0.4s ease-out both",
        "enter-1": "enter 0.4s ease-out 0.1s both",
        "enter-2": "enter 0.4s ease-out 0.2s both",
      },
      keyframes: {
        enter: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
