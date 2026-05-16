import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        eyf: {
          page: "#1c1c1c",
          gold: "#e0be53",
          footer: "#1f2024",
          accentBlue: "#0088cc",
          muted: "#777777",
          border: "#eee",
          btnGray: "#444444",
          btnHover: "#1c1c1c",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        opensans: ["var(--font-open-sans)", "sans-serif"],
      },
      maxWidth: {
        container: "1140px", // Standard Elementor/Bootstrap container width
      },
      screens: {
        navlg: "1025px",
      },
      animation: {
        fadeInDown: "fadeInDown 0.9s ease-out both",
      },
      keyframes: {
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translate3d(0, -18px, 0)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
