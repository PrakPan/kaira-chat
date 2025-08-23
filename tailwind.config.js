/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "inter-regular": ["Inter Regular", "sans-serif"],
        "inter-bold": ["Inter Bold", "sans-serif"],
      },
      fontWeight: {
        100: "100", // Thin
        200: "200", // Extra Light
        300: "300", // Light
        350: "350", // Custom weight
        400: "400", // Regular
        500: "500", // Medium
        600: "600", // Semi Bold
        700: "700", // Bold
        800: "800", // Extra Bold
        900: "900", // Black
      },
      height: {
        300: "300px",
        557: "557px",
        mapheightFull: "900px",
        mapScrollheightFull: "600px",
        mapheightMob: "800px",
        Onsiteheight: "120%",
        OnsiteheightM: "110vh",
        onsitegridheight: "75vh",
        headerHeight: "70vh",
        onsiteimage: "140px",
        perkimageheight: "7.5rem",
        contactheighttab: "6rem",
        contactheightmobile: "4.5rem",
        heading: "3rem",
        subheading: "1.6rem",
        careerheaderHeight: "60vh",
        careerheaderMobileH: "40vh",
        navsmall: "14px",
        navsmallne: "10px;",
        descnew: "1rem",
        highheight: "42 rem",
      },
      colors: {
        // Primary Colors
        primary: {
          yellow: "#F7E700",
          indigo: "#07213A",
        },
        // Secondary Colors
        secondary: {
          green: "#4CAF50",
          blue: "#2196F3",
          coral: "#FF6B6B",
          red: "#F44336",
        },
        // Text Colors
        text: {
          focused: "#333333",
          default: "#6B7280",
          placeholder: "#C7C7C7",
          disabled: "#E5E5E5",
          white: "#FFFFFF",
          stroke: "#F8F8F8",
          background: "#F8F8F8",
        },
        // Legacy support
        blue: "#0000EE",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        slideRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        popOut: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        slideDown: "slideDown 0.2s ease-in-out",
        slideUp: "slideUp 0.2s ease-in-out",
        slideRight: "slideRight 0.3s ease-in-out",
        popOut: "popOut 0.2s ease-in-out",
      },
      dropShadow: {
        "3xl": "0px 0px 50px rgba(0, 0, 0, 0.25)",
      },
      gap: {
        l: "12px",
      },
    },
  },
  plugins: [],
};
