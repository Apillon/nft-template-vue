export const colors = {
  primary: '#F9FF73',
  secondary: '#78DCE8',
  transparent: 'transparent',
  current: 'currentColor',

  black: '#000000',
  white: '#FFFFFF',
  yellow: '#F9FF73',
  orange: '#F7AF39',
  pink: '#FF6188',
  green: '#A9DC76',
  violet: '#AB9DF2',
  blue: '#78dce8',

  bg: '#f0f2da',
  bgDark: '#313442',
  bgDarker: '#141721',

  grey: {
    DEFAULT: '#ccc',
    transparent: 'rgba(153, 153, 153, 0.64)', // #99999a3
    dark: '#141721', // rgba(20, 23, 33, 1)
    darker: '#1e212b', // rgba(30, 33, 43, 1)
    darkerTransparent: 'rgba(30, 33, 43, 0.64)', // #1e212ba3
  },
};

/** @type {import('tailwindcss').Config} */
export default {
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

    colors,

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
      borderWidth: {
        1: '1px',
        3: '3px',
      },
      boxShadow: {
        black: '0px 2px 4px rgba(0, 0, 0, 0.12)',
        light: '0px 0px 4px rgba(240, 242, 218, 0.64)',
      },
      gridTemplateColumns: {
        nft: 'repeat(auto-fill, minmax(280px, 1fr))',
        nftSmall: 'repeat(auto-fill, minmax(180px, 1fr))',
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
