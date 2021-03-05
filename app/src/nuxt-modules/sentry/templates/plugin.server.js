import * as Sentry from '@sentry/node'
import { nodeOptions } from '@/config/sentry.config'

const apiMethods = <%= JSON.stringify(options.apiMethods)%>

export default function (ctx, inject) {
  const SentryMock = {}
  apiMethods.forEach(key => {
    SentryMock[key] = <%= options.enableLogMockCalls
      ? '(...args) => console.warn(`$sentry.${key}() called, but Sentry plugin is disabled. Arguments:`, args)'
      : '_ => _'%>
  })

  const sentryEnvConfig = {
    SENTRY_DSN: process.env.SENTRY_DSN || '',
    SENTRY_DISABLED: process.env.SENTRY_DISABLED === 'false'
      ? false
      : process.env.SENTRY_DISABLED === ''
        ? false
        : true,
  }

  /**
   * Provide Sentry config to client.
   */
  ctx.beforeNuxtRender(({ nuxtState }) => {
    nuxtState.sentry = sentryEnvConfig
  })

  if (!sentryEnvConfig.SENTRY_DSN || sentryEnvConfig.SENTRY_DISABLED) {
    // Inject mocked sentry to the context as $sentry (this is used in case sentry is disabled)
    inject('sentry', SentryMock)
    ctx.$sentry = SentryMock
  } else {
    Sentry.init({
      dsn: sentryEnvConfig.SENTRY_DSN,
      <%= options.releaseName ? `release: '${options.releaseName}',` : '' %>
      ...nodeOptions,
    })

    // Setting tags on error for indexed and searchable.
    Sentry.setTags({
      platform: process.server ? 'server' : 'client',
      project: 'nuxt',
    })

    process.sentry = Sentry

    inject('sentry', Sentry)
    ctx.$sentry = Sentry
  }
}
