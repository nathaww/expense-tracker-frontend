import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        bg: "var(--bg)",
        text: "var(--text)",
      },
      borderRadius: {
        custom: "var(--border-radius)",
      },
      fontFamily: {
        custom: "var(--font)",
      },
    },
  },
  plugins: [],
};
export default config;
