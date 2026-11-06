import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gdg-blue": "#4285F4",
        "gdg-red": "#EA4335",
        "gdg-yellow": "#FBBC04",
        "gdg-green": "#34A853",
        primary: {
          DEFAULT: "#4285F4",
          hover: "#3367D6",
          foreground: "#FFFFFF",
          subtle: "#E8F0FE",
        },
        surface: {
          page: "var(--surface-page)",
          card: "var(--surface-card)",
          subtle: "var(--surface-subtle)",
        },
        border: {
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

