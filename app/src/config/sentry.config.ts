import Vue from 'vue'
import { Event, EventHint, Options as BaseOptions } from '@sentry/types'
import { NodeOptions } from '@sentry/node'
import { init as sentryBrowserInit } from '@sentry/vue/dist/sdk'
import {
  Dedupe,
  ExtraErrorData,
  RewriteFrames,
  ReportingObserver,
} from '@sentry/integrations'

type BrowserOptions = Parameters<typeof sentryBrowserInit>[0]

const ignoreErrorInBeforeSend: IgnoreErrorInBeforeSend[] = [
  {
    check: (event, hint) => {
      // Ignore fbevent.js postMessage error in iOS device
      if (hint?.originalException?.stack) {
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

const baseOptions: BaseOptions = {
  ignoreErrors: [
    'Network Error',
    /postMessage/,
    // Chrome extensions, https://docs.sentry.io/clients/javascript/tips/
    /extensions\//i,
    /^chrome:\/\//i,
  ],
  beforeSend: (event, hint) => {
    const shouldIgnoreError = ignoreErrorInBeforeSend.some((rule) =>
      rule.check(event, hint)
    )
    return shouldIgnoreError ? null : event
  },
}

export const browserOptions: BrowserOptions = {
  ...baseOptions,
  integrations: [
    new Dedupe(),
    new ExtraErrorData(),
    new RewriteFrames(),
    new ReportingObserver(),
  ],
  // Ref: https://docs.sentry.io/platforms/javascript/guides/vue/
  Vue,
  attachProps: true,
  logErrors: !(process.env.NODE_ENV !== 'production'),
  tracingOptions: {
    trackComponents: true,
    timeout: 2000,
  },
}

export const nodeOptions: NodeOptions = {
  ...baseOptions,
  integrations: [new Dedupe(), new ExtraErrorData(), new RewriteFrames()],
}
