import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        script: ["var(--font-dancing)", "cursive"],
      },
      colors: {
        ink: "#0a0a0a",
        paper: "#f5f5f4",
        muted: "#a3a3a3",
      },
      animation: {
        "sound-bar": "soundBar 1.2s ease-in-out infinite",
        "spin-orbit": "spinOrbit 4.8s linear infinite",
      },
      keyframes: {
        soundBar: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        spinOrbit: {
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
