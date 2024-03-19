/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`,
  ],
  darkMode: 'class',
  theme: {
    screens: {
      mobile: { max: '767px' },
      tablet: { max: '1023px' },
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      hd: '1920px',
    },

    colors: {
      primary: '#F9FF73',
      secondary: '#78DCE8',

      black: '#000000',
      white: '#FFFFFF',
      yellow: '#F9FF73',
      orange: '#F7AF39',
      green: '#A9DC76',
      violet: '#AB9DF2',
      blue: '#78dce8',

      bg: '#f0f2da',
      bgDark: '#141721',
    },

    fontFamily: {
      sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui'],
      inter: ['Inter', 'ui-sans-serif', 'system-ui'],
    },

    container: {
      center: true,
      screens: {
        lx: '1440px',
      },
      padding: {
        DEFAULT: '1rem',
      },
    },

    extend: {
      backgroundImage: {
        gradientDark: 'linear-gradient(180deg, #06080F 0%, rgba(6, 8, 15, 0) 100%)',
        gradientDarkReverse: 'linear-gradient(180deg, rgba(6, 8, 15, 0) 0%, #06080F 100%)',
        w3Warn:
          'linear-gradient(260deg, #F9FF73 0%, #78DCE8 20.31%, #F7AF39 39.58%, #FF6188 59.37%, #A9DC76 79.17%, #AB9DF2 100%)',
      },
      borderWidth: {
        1: '1px',
        3: '3px',
      },
      boxShadow: {
        black: '0px 2px 4px rgba(0, 0, 0, 0.12)',
        light: '0px 0px 4px rgba(240, 242, 218, 0.64)',
      },
      gridTemplateColumns: {
        billing: 'repeat(auto-fill, minmax(23rem, 1fr))',
        services: 'repeat(auto-fit, minmax(280px, 1fr))',
        nft: 'repeat(auto-fill, minmax(220px, 1fr))',
        nftSmall: 'repeat(auto-fill, minmax(120px, 1fr))',
      },
      scale: {
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
      },
      zIndex: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
      },
    },
  },

  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
