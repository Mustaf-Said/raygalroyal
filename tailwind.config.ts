import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin"
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // ✅ Support light: variant for light mode
    plugin(({ addVariant }) => {
      addVariant("light", "&:where(.light, .light *)")
    }),
  ],
  darkMode: "class",
};

export default config;
