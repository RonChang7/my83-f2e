import { Plugin as NuxtPlugin } from '@nuxt/types'
import * as SentryClientTypes from '@sentry/browser'
import { sentryInitConfig } from '@/config/sentry.config'

/**
 * @TODO:
 * 1. 由於目前打包的時候不提供 .env 檔案，故目前 Sentry client 不會正常 init，故先在這邊進行手動 init
 * 2. Release tag 在 server-side 透過 src/nuxt-modules/sentry 的 module 建立 json file，
 *    並在 $nuxt.hook ready 階段時進行讀檔並注入 process.env，將其寫入 $env，讓 client 端可以讀取
 */
export default (({ app, beforeNuxtRender }) => {
  const isSentryEnable =
    app.$env.SENTRY_DISABLED === 'false' ||
    app.$env.SENTRY_DISABLED === undefined

  if (isSentryEnable) {
    if (process.server) {
      // 寫入方式請參考 nuxt-env
      beforeNuxtRender(({ nuxtState }) => {
        nuxtState.env.SENTRY_RELEASE_TAG = process.env.SENTRY_RELEASE_TAG
      })
    } else {
      ;((app.$sentry as unknown) as typeof SentryClientTypes).init({
        ...sentryInitConfig,
        dsn: app.$env.SENTRY_DSN,
        release: app.$env.SENTRY_RELEASE_TAG,
      })
    }
  }
}) as NuxtPlugin
