import { type Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        iransans: "Iransans",
      },
      textColor: {
        primary: withOpacity("--primary"),
        secondary: withOpacity("--secondary"),
        primbuttn: withOpacity("--primbuttn"),
        secbuttn: withOpacity("--secbuttn"),
        accent: withOpacity("--accent"),
        ...colors,
      },
      backgroundColor: {
        primary: withOpacity("--primary"),
        secondary: withOpacity("--secondary"),
        primbuttn: withOpacity("--primbuttn"),
        secbuttn: withOpacity("--secbuttn"),
        accent: withOpacity("--accent"),
        ...colors,
      },
      borderColor: {
        primary: withOpacity("--primary"),
        secondary: withOpacity("--secondary"),
        primbuttn: withOpacity("--primbuttn"),
        secbuttn: withOpacity("--secbuttn"),
        accent: withOpacity("--accent"),
        ...colors,
      },
      boxShadowColor: {
        primary: withOpacity("--primary"),
        secondary: withOpacity("--secondary"),
        primbuttn: withOpacity("--primbuttn"),
        secbuttn: withOpacity("--secbuttn"),
        accent: withOpacity("--accent"),
        ...colors,
      },
      fill: {
        primary: withOpacity("--primary"),
        secondary: withOpacity("--secondary"),
        primbuttn: withOpacity("--primbuttn"),
        secbuttn: withOpacity("--secbuttn"),
        accent: withOpacity("--accent"),
        ...colors,
      },
      stroke: {
        primary: withOpacity("--primary"),
        secondary: withOpacity("--secondary"),
        primbuttn: withOpacity("--primbuttn"),
        secbuttn: withOpacity("--secbuttn"),
        accent: withOpacity("--accent"),
        ...colors,
      },
      ringColor: {
        primary: withOpacity("--primary"),
        secondary: withOpacity("--secondary"),
        primbuttn: withOpacity("--primbuttn"),
        secbuttn: withOpacity("--secbuttn"),
        accent: withOpacity("--accent"),
        ...colors,
      },
      gradientColorStops: {
        primary: withOpacity("--primary"),
        secondary: withOpacity("--secondary"),
        primbuttn: withOpacity("--primbuttn"),
        secbuttn: withOpacity("--secbuttn"),
        accent: withOpacity("--accent"),
        ...colors,
      },
      screens: {
        mobileMax: { max: "500px" },
        // => @media (min-width: 640px) { ... }

        laptopMax: { max: "1279px" },
        // => @media (min-width: 1024px) { ... }

        desktopMax: { max: "1280px" },
        // => @media (min-width: 1280px) { ... }

        // --------------------Min--------------------------

        mobileMin: { min: "500px" },
        // => @media (min-width: 640px) { ... }

        laptopMin: { min: "1279px" },
        // => @media (min-width: 1024px) { ... }

        desktopMin: { min: "1280px" },
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;
