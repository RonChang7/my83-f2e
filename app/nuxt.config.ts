import { Configuration } from '@nuxt/types'
require('dotenv').config()

const config: Configuration = {
  server: {
    port: process.env.PORT,
  },
  mode: 'universal',
  srcDir: './src',
  globalName: 'my83',
  /*
   ** Headers of the page
   */
  head: {
    title: 'MY83 保險網－把保險變簡單',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'MY83 把保險變簡單，幫助你讓生活更有保障。保險其實是很好的概念，能減輕遭遇風險時的負擔。MY83 不是保險業務員，也和任何保險公司無關，保戶在這裡使用任何資源都是免費的。我們從保戶的立場成立保險媒合平台，希望讓大家有能力可以分辨適合自己的保險。幫助消費者保險買對不買貴，也讓專業的業務員服務更多的消費者！',
      },
      { property: 'og:site_property', content: 'MY83 保險網' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'zh_TW' },
      { property: 'fb:app_id', content: process.env.FACEBOOK_APP_ID! },
      { property: 'fb:admins', content: '217752' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/static/favicon.ico' }],
    bodyAttrs: {
      ontouchstart: '',
    },
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ef6e2e' },
  /*
   ** Global CSS
   */
  css: ['@/sass/main.scss', '@/sass/fonts.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/register-store',
    '@/plugins/sync-page-module-register-middleware',
    '@/plugins/axios-setup',
    '@/plugins/app-init',
    {
      src: '@/plugins/personalized-header',
      mode: 'client',
    },
    {
      src: '@/plugins/polyfill',
      mode: 'client',
    },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxt/typescript-build',
    '@/nuxt-modules/flexible-routes/module',
    '@/nuxt-modules/classic-store/module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    [
      // ref: https://github.com/samtgarson/nuxt-env
      'nuxt-env',
      {
        keys: [
          // secret: Only inject the var server side
          { key: 'APP_ENV' },
          { key: 'API_URL' },
          { key: 'HOST_URL' },
          { key: 'JWT_TOKEN_NAME' },
          { key: 'HEALTH_CHECK_AGENT_STRING' },
          { key: 'FACEBOOK_APP_ID' },
          { key: 'ZENDESK_CHAT_ID' },
        ],
      },
    ],
    'nuxt-user-agent',
  ],
  router: {
    middleware: 'index',
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // extend(config, ctx) {},
  },
  typescript: {
    typeCheck: {
      eslint: true,
      memoryLimit: 2048,
      workers: 2,
    },
  },
}

export default config
