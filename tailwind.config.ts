import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin"
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
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
