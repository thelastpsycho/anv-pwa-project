/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        anvaya: {
          blue: "#89a8b2",
          light: "#b3c8cf",
          gray: "#e5e1da",
          cream: "#f1f0e8",
          dark: "#1f2937",
        },
      },
      keyframes: {
        logoFadeIn: {
          from: {
            opacity: "0",
            transform: "scale(0.95)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        cardsFadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        logoFadeIn: "logoFadeIn 0.8s ease-out 0.3s forwards",
        cardsFadeIn: "cardsFadeIn 0.8s ease-out 0.6s forwards",
      },
    },
  },
  plugins: [],
};
