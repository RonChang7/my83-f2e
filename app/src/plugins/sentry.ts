import { Plugin as NuxtPlugin } from '@nuxt/types'
import * as SentryClientTypes from '@sentry/browser'

/**
 * @TODO:
 * 1. 由於目前打包的時候不提供 .env 檔案，故目前 Sentry client 不會正常 init，
 *    故先在這邊進行手動 init
 * 2. Release tag 在 server-side 會 generate，從 server-side 取得後，
 *    將其寫入 $env，在從前端讀取
 */
export default (({ app, beforeNuxtRender }) => {
  const isSentryEnable =
    app.$env.SENTRY_DISABLED === 'false' ||
    app.$env.SENTRY_DISABLED === undefined

  if (isSentryEnable) {
    if (process.server) {
      getSentryReleaseTag().then((releaseTag) => {
        // 寫入方式請參考 nuxt-env
        beforeNuxtRender(({ nuxtState }) => {
          nuxtState.env = {
            ...nuxtState.env,
            SENTRY_RELEASE_TAG: releaseTag,
          }
        })
      })
    } else {
      ;((app.$sentry as unknown) as typeof SentryClientTypes).init({
        dsn: app.$env.SENTRY_DSN,
        release: app.$env.SENTRY_RELEASE_TAG,
      })
    }
  }
}) as NuxtPlugin

const getSentryReleaseTag = async () => {
  // eslint-disable-next-line no-undef
  const SentryCli = await __non_webpack_require__('@sentry/cli')
  const cli = new SentryCli()
  const releaseTag = (await cli.releases.proposeVersion()).trim()
  return releaseTag
}
