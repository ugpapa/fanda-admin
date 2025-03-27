import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f8ff",
          100: "#ebf1ff",
          200: "#d6e4ff",
          300: "#c2d6ff",
          400: "#99bbff",
          500: "#709fff",
          600: "#3d75ff",
          700: "#1a56ff",
          800: "#0042ff",
          900: "#0036d9",
          950: "#002db3",
        },
      },
    },
  },
  plugins: [],
};

export default config; 