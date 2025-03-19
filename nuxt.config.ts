// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,

  devServer: {
    port: 3001,
  },

  typescript: { shim: false },

  runtimeConfig: {
    public: {
      CHAIN_ID: process.env.CHAIN_ID,
      CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
      APILLON_API_URL: process.env.APILLON_API_URL,
      COLLECTION_BUCKET_UUID: process.env.COLLECTION_BUCKET_UUID,
      APILLON_API_KEY: process.env.APILLON_API_KEY,
      APILLON_API_SECRET: process.env.APILLON_API_SECRET,
    }
  },

  css: ['@/assets/css/main.css', '@/assets/css/tooltip.css'],
  components: ['./components'],

  modules: [
    '@vueuse/nuxt',
    'nuxt-icons',
    [
      '@nuxtjs/google-fonts',
      {
        useStylesheet: true,
        display: 'swap',
        download: false,
        families: {
          'IBM Plex Sans': {
            wght: [400, 700],
          },
        },
      },
    ],
  ],

  imports: {
    dirs: ['./lib', './types'],
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

  compatibilityDate: '2025-03-19',
});