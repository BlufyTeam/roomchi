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
    },
  },
  plugins: [],
} satisfies Config;
