/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['lexend'],
    },
    extend: {
      height: {
        300: '300px',
        557: '557px',
        mapheightFull: '900px',
        mapScrollheightFull: '600px',
        mapheightMob: '800px',
        Onsiteheight: '120%',
        OnsiteheightM: '110vh',
        onsitegridheight: '75vh',
        headerHeight: '70vh',
        onsiteimage: '140px',
        perkimageheight: '7.5rem',
        contactheighttab: '6rem',
        contactheightmobile: '4.5rem',
        heading: '3rem',
        subheading: '1.6rem',
        careerheaderHeight: '60vh',
        careerheaderMobileH: '40vh',
        navsmall: '14px',
        navsmallne: '10px;',
        descnew: '1rem',
        highheight: '42 rem',
      },
    },
  },
  plugins: [],
};
