/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directorys:
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
      fontSize: {
        "xxs": "8px",
        "xs": "10px",
        "sm": "12px",
        "sm-md": "14px",
        "sm-xl": "15px",
        "md": "16px",
        "md-lg": "18px",
        "lg": "20px",
        "xl": "24px",
        "xl-md" : "28px",
        "2xl": "32px",
        "2xl-md": "36px",
        "2xl-lg": "38px",
        "3xl": "40px",
        "4xl": "48px",
        "5xl": "56px",
        "6xl": "64px",
        "7xl": "72px"
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
      lineHeight: {
        "xxs": "8px",
        "xs": "10px",
        "sm": "12px",
        "sm-md": "14px",
        "md": "16px",
        "md-lg": "18px",
        "lg": "20px",
        "lg-md": "22px",
        "xl": "24px",
        "xl-sm": "26px",
        "xl-md": "28px",
        "xl-lg": "30px",
        "2xl": "32px",
        "2xl-md": "36px",
        "3xl": "40px",
        "4xl": "48px",
        "5xl": "56px",
        "6xl": "64px",
        "7xl": "72px",
      },
      spacing: {
        "auto": "auto",
        "zero": "0px",
        "xxs": "4px",
        "xxs-md": "6px",
        "xs": "8px",
        "xs-md": "10px",
        "sm": "12px",
        "sm-md": "14px",
        "md": "16px",
        "md-lg": "18px",
        "lg": "20px",
        "xl": "24px",
        "xl-lg": "28px",
        "2xl": "32px",
        "3xl": "40px",
        "4xl": "48px",
        "5xl": "56px",
        "6xl": "64px",
        "7xl": "72px",
        "8xl": "80px",
        "9xl": "96px",
        "10xl": "112px",
        "11xl": "128px",
      },
      borderRadius: {
        "xxs": "1px",
        "xs": "2px",
        "sm": "4px",
        "sm-md": "5px",
        "md": "6px",
        "md-lg": "8px",
        "lg": "10px",
        "xl": "12px",
        "2xl": "14px",
        "3xl": "16px",
        "4xl": "18px",
        "5xl": "20px",
        "6xl": "24px",
        "7xl": "28px",
        "8xl": "36px",
        "9xl": "42px",
        "67br": "6777px",
        "circle": "50%",
      },
      borderWidth: {
        "sm": "1px",
        "md": "2px",
        "lg": "3px",
        "xl": "4px",
        "2xl": "5px",
        "3xl": "6px",
        "4xl": "7px",
        "5xl": "8px",
        "6xl": "9px",
        "7xl": "10px",
      },
      borderStyle: {
        solid: "solid",
        dashed: "dashed",
        dotted: "dotted",
        double: "double",
        none: "none",
      },
      boxShadow: {
        'soft': '0 4px 34px rgba(195, 195, 195, 0.25)',
      },
      screens: {
        'max-xs': { max: '429px' },
        'max-sm': { max: '639px' },
        'max-ph': { max: '768px' },
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
        blue: "#3A85FC",
        pureBlack : '#000',
        lightGreen:"#D5F5D3",
        lightPink:"#FADADD",
        primary: {
          yellow: "#F7E700",
          indigo: "#07213A",
          stars: "#FFD201",
          cornsilk: "#FFFAF5",
          jasmineWhite: "#FFFFE7"
        },
        // Secondary Colors
        secondary: {
          green: "#4CAF50",
          blue: "#2196F3",
          coral: "#FF6B6B",
          red: "#F44336",
        },
        trans: {
          black_70: "rgba(0, 0, 0, 0.72)"
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
          smokywhite: "#f2f2f2e6",
          charcolblack: "#212529",
          spacegrey: "#6E757A",
          smoothwhite: "#f6f6f6",
          svgIconFill: "#ACACAC",
          chinesWhite: "#F9F9F9",
          error: "#FA3530"
        },
        tag : {
          sky:"#2AB0FC",
          grass:"#5CBA66"
        }
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
