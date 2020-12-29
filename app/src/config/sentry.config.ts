import { Options, Event, EventHint } from '@sentry/types'

export const sentryInitConfig: Options = {
  ignoreErrors: ['Network Error', /postMessage/],
  beforeSend(event, hint) {
    const shouldIgnoreError = ignoreErrorInBeforeSend.some((rule) =>
      rule.check(event, hint)
    )
    return shouldIgnoreError ? null : event
  },
}

const ignoreErrorInBeforeSend: IgnoreErrorInBeforeSend[] = [
  {
    check: (event, hint) => {
      // Ignore fbevent.js postMessage error in iOS device
      if (hint?.originalException?.['stack']) {
        // eslint-disable-next-line dot-notation
        const errorStack = JSON.stringify(hint.originalException['stack'])
        return /postMessage/.test(errorStack)
      }

      return false
    },
  },
]

interface IgnoreErrorInBeforeSend {
  check(event: Event, hint?: EventHint): boolean
}
