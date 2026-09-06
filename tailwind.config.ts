import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        clay: {
          50: "#faf6f2",
          100: "#f2e8df",
          200: "#e4cdb9",
          300: "#d3ab8c",
          400: "#c08a63",
          500: "#a96f47",
          600: "#8f5738",
          700: "#734530",
          800: "#5f3a2b",
          900: "#503227",
        },
      },
    },
  },
  plugins: [],
};

export default config;
