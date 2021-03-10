import { NuxtConfig } from '@nuxt/types'
require('dotenv').config()

const config: NuxtConfig = {
  server: {
    port: process.env.PORT,
  },
  srcDir: './src',
  globalName: 'my83',
  /*
   ** Headers of the page
   */
  head: {
    title: 'MY83 保險網－把保險變簡單',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=0',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'MY83 把保險變簡單，幫助你讓生活更有保障。保險其實是很好的概念，能減輕遭遇風險時的負擔。MY83 不是保險業務員，也和任何保險公司無關，保戶在這裡使用任何資源都是免費的。我們從保戶的立場成立保險媒合平台，希望讓大家有能力可以分辨適合自己的保險。幫助消費者保險買對不買貴，也讓專業的業務員服務更多的消費者！',
      },
      { property: 'og:site_property', content: 'MY83 保險網' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'zh_TW' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'https://images.my83.com.tw/front/common/favicon.ico',
      },
    ],
    htmlAttrs: {
      lang: 'zh-TW',
    },
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
  css: ['@/sass/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/register-store',
    '@/plugins/sync-page-module-register-middleware',
    {
      src: '@/plugins/auth',
      mode: 'client',
    },
    '@/plugins/axios-setup',
    '@/plugins/app-init',
    {
      src: '@/plugins/polyfill',
      mode: 'client',
    },
    {
      src: '@/plugins/analytics',
      mode: 'client',
    },
    {
      src: '@/plugins/personalized-header',
      mode: 'client',
    },
    {
      src: '@/plugins/recaptcha',
      mode: 'client',
    },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/composition-api',
    '@nuxt/typescript-build',
    '@/nuxt-modules/flexible-routes/module',
    '@/nuxt-modules/classic-store/module',
    '@/nuxt-modules/sentry/module',
    'nuxt-svg-loader',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      // ref: https://github.com/samtgarson/nuxt-env
      'nuxt-env',
      {
        keys: [
          // secret: Only inject the var server side
          { key: 'APP_ENV' },
          { key: 'API_URL' },
          { key: 'HOST_URL' },
          { key: 'API_SERVER_BASIC_AUTH_BASE64' },
          { key: 'JWT_TOKEN_NAME' },
          { key: 'HEALTH_CHECK_AGENT_STRING' },
          { key: 'FACEBOOK_APP_ID' },
          { key: 'FACEBOOK_ADMIN_ID' },
          { key: 'ZENDESK_CHAT_ID' },
          { key: 'TRACKING_ENABLE' },
          { key: 'TRACKING_DEV_LOG_ENABLE' },
          { key: 'FACEBOOK_PIXEL_IDS' },
          { key: 'GOOGLE_ANALYTICS_ID' },
          { key: 'RECAPTCHA_SITE_KEY' },
          { key: 'RECAPTCHA_VERSION' },
          { key: 'IMAGE_BUCKET_URL' },
        ],
      },
    ],
    'nuxt-user-agent',
    'nuxt-webfontloader',
    'cookie-universal-nuxt',
  ],
  webfontloader: {
    google: {
      families: [
        'Noto+Sans+TC:400,500,700&display=swap&subset=chinese-traditional',
      ],
    },
  },
  router: {
    middleware: 'index',
  },
  serverMiddleware: ['~/server/middleware/logger.ts'],
  typescript: {
    typeCheck: {
      typescript: {
        memoryLimit: Number(process.env.TS_TYPE_CHECK_MEMORY_LIMIT) || 2048, // default: 2048MB
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    corejs: 3,
    transpile: [
      ({ isDev, isClient }) => (!isDev && isClient && 'dom-utils') || undefined,
      ({ isDev, isClient }) => (!isDev && isClient && 'autotrack') || undefined,
    ],
    loaders: {
      scss: {
        // Doc: https://github.com/vuejs/vue-loader/blob/master/docs/guide/pre-processors.md#sharing-global-variables
        // @ts-ignore
        additionalData: '$image-bucket-url: "https://images.my83.com.tw";',
      },
    },
    extend(config, ctx) {
      if (ctx.isClient && !ctx.isDev) {
        // Adding client-side source map for sentry
        config.devtool = 'hidden-source-map'
      }
    },
  },
  telemetry: false,
}

export default config
