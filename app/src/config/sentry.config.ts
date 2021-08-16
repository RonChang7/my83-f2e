import Vue from 'vue'
import { Event, EventHint, Options as BaseOptions } from '@sentry/types'
import { NodeOptions } from '@sentry/node'
import { init as sentryBrowserInit } from '@sentry/vue/dist/sdk'
import { Dedupe, ExtraErrorData, RewriteFrames } from '@sentry/integrations'

type BrowserOptions = Parameters<typeof sentryBrowserInit>[0]

const crawlerUserAgentList = ['bingbot']

const ignoreErrorInBeforeSend: IgnoreErrorInBeforeSend[] = [
  {
    check: (event, hint) => {
      // Ignore fbevent.js postMessage error in iOS device
      // eslint-disable-next-line dot-notation
      if (hint?.originalException?.['stack']) {
        // eslint-disable-next-line dot-notation
        const errorStack = JSON.stringify(hint.originalException['stack'])
        return /postMessage/.test(errorStack)
      }

      return false
    },
  },
  {
    check: (event, hint) => {
      // Ignore crawler 404 error in server side (client side error will ignore by online Sentry config)
      const userAgent =
        // eslint-disable-next-line dot-notation
        hint?.originalException?.['config']?.['headers']?.['user-agent']

      if (!userAgent) return false

      // eslint-disable-next-line dot-notation
      const statueCode = hint?.originalException?.['response']?.status

      const shouldIgnoreError = !!(
        crawlerUserAgentList.find((crawlerUserAgent) =>
          userAgent.includes(crawlerUserAgent)
        ) && statueCode === 404
      )

      return shouldIgnoreError
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
  integrations: [new Dedupe(), new ExtraErrorData(), new RewriteFrames()],
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
