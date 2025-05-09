import _ from 'lodash'
import * as SentryTypes from '@sentry/minimal'

export const sentryLog = (
  sentry: typeof SentryTypes,
  err: any,
  detail: ErrorDetail
) => {
  sentry.withScope((scope) => {
    const { statusCode, method, apiUrl, message } = detail
    const platform = process.server ? 'server' : 'client'
    const project = 'nuxt'
    const tags = _.reduce(
      {
        status_code: statusCode,
        method,
        api_url: apiUrl,
        process: platform,
        project,
        message,
      },
      (result, value, key) => {
        if (typeof value !== 'undefined') {
          result[key] = String(value)
        }

        return result
      },
      {}
    )

    scope.setTags(tags)
    scope.setFingerprint([String(statusCode), platform, project])
    sentry.captureException(err)
  })
}

interface ErrorDetail {
  statusCode?: string
  method?: string
  apiUrl?: string
  message: string
}
