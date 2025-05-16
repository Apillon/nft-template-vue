import mkcert from 'vite-plugin-mkcert';
import { moonbaseAlpha } from 'viem/chains';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,

  devServer: {
    port: 3001,
    // https: {
    //   key: process.env.USERPROFILE + '\\.vite-plugin-mkcert\\cert.key',
    //   cert: process.env.USERPROFILE + '\\.vite-plugin-mkcert\\cert.crt',
    // },
  },

  typescript: { shim: false },

  runtimeConfig: {
    public: {
      CHAIN_ID: moonbaseAlpha.id,
      CONTRACT_ADDRESS: '',
      EMBEDDED_WALLET_CLIENT: '',
      IMG_LOGO: '',
      IMG_COVER: '',
      WALLET_CONNECT_PROJECT: '',
    },
  },

  css: ['@/assets/css/main.css', '@/assets/css/tooltip.css'],

  components: ['./components'],

  modules: ['@vueuse/nuxt', 'nuxt-icons', '@nuxtjs/google-fonts', '@nuxtjs/tailwindcss'],

  imports: {
    dirs: ['./lib', './types'],
  },

  vite: {
    plugins: [nodePolyfills(), mkcert()],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },

      title: 'Apillon - NFTs',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#f0f2da' },
        { name: 'description', content: 'Apillon - NFT template', hid: 'description' },
        { name: 'og:title', content: 'Apillon - NFT', hid: 'og:title' },
        { name: 'og:description', content: 'Apillon - NFT template', hid: 'og:description' },
        { name: 'og:type', content: 'website' },
      ],

      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },

  googleFonts: {
    useStylesheet: true,
    display: 'swap',
    download: false,
    families: {
      'IBM Plex Sans': {
        wght: [400, 700],
      },
      Inter: {
        wght: [400, 700],
      },
    },
  },

  tailwindcss: { cssPath: '~/assets/css/tailwind.css' },

  compatibilityDate: '2025-05-13',
});
