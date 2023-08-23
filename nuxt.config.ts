import dev from './config/development';
import prod from './config/production';

const env = process.env.ENV || process.env.RUN_ENV || process.env.NODE_ENV;
const appConfig = env === 'development' ? dev : prod;

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,

  devServer: {
    port: 3001,
  },

  typescript: { shim: false },

  runtimeConfig: {
    public: appConfig,
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
});
