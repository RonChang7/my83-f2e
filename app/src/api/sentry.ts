import * as SentryTypes from '@sentry/minimal'
import { Severity } from '@sentry/types'

export const sentryLog = (
  sentry: typeof SentryTypes,
  err: any,
  detail: ErrorDetail
) => {
  sentry.withScope((scope) => {
    const { statusCode, method, apiUrl, message, severity } = detail
    const platform = process.server ? 'server' : 'client'
    const project = 'nuxt'

    scope.setTags({
      status_code: String(statusCode),
      method: String(method),
      api_url: String(apiUrl),
      process: platform,
      project,
    })

    scope.setFingerprint([String(statusCode), platform, project])
    sentry.captureMessage(message, severity || Severity.Error)
    sentry.captureException(err)
  })
}

interface ErrorDetail {
  statusCode?: string
  method?: string
  apiUrl?: string
  message: string
  severity?: Severity
}
