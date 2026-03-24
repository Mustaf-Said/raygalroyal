import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // ✅ Support light: variant for light mode
    function ({ addVariant }) {
      addVariant('light', '&:where(.light, .light *)');
    }
  ],
  darkMode: "class",
};

export default config;
