import * as Sentry from '@sentry/vue'
import { browserOptions } from '@/config/sentry.config'

const apiMethods = <%= JSON.stringify(options.apiMethods)%>

export default function (ctx, inject) {
  const SentryMock = {}
  apiMethods.forEach(key => {
    SentryMock[key] = <%= options.enableLogMockCalls
      ? '(...args) => console.warn(`$sentry.${key}() called, but Sentry plugin is disabled. Arguments:`, args)'
      : '_ => _'%>
  })

  /**
   * Get Sentry config to from server which inject to nuxtState.
   * Due to different lifecycle, we cannot get ctx.$env from here.
   */
  if (!ctx.nuxtState.sentry.SENTRY_DSN || ctx.nuxtState.sentry.SENTRY_DISABLED) {
    // Inject mocked sentry to the context as $sentry (this is used in case sentry is disabled)
    inject('sentry', SentryMock)
    ctx.$sentry = SentryMock
  } else {
    Sentry.init({
      dsn: ctx.nuxtState.sentry.SENTRY_DSN,
      <%= options.releaseName ? `release: '${options.releaseName}',` : '' %>
      ...browserOptions,
    })

    // Setting tags on error for indexed and searchable.
    Sentry.setTags({
      platform: process.server ? 'server' : 'client',
      project: 'nuxt',
    })

    inject('sentry', Sentry)
    ctx.$sentry = Sentry
  }
}
