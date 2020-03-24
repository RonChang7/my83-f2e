import { Plugin as NuxtPlugin } from '@nuxt/types'
import {
  AnalyticsEventManager,
  EventProviderEnv,
} from '@/analytics/event-manager/analytics-event-manager'

export default (({ app }, inject) => {
  const {
    APP_ENV,
    TRACKING_ENABLE,
    TRACKING_DEV_LOG_ENABLE,
    FACEBOOK_PIXEL_ID,
    GOOGLE_ANALYTICS_ID,
  } = app.$env

  const env: EventProviderEnv = {
    facebookPixel: {
      id: FACEBOOK_PIXEL_ID,
    },
    googleAnalytics: {
      id: GOOGLE_ANALYTICS_ID,
    },
  }

  const trackingLogEnable =
    TRACKING_DEV_LOG_ENABLE === 'true' && APP_ENV !== 'production'

  const AEM = AnalyticsEventManager.getInstance({
    trackingEnable: TRACKING_ENABLE === 'true',
    trackingLogEnable,
    env,
  })

  inject('analytics', <P>(eventName, payload?: P) =>
    AEM.trigger(eventName, payload)
  )
}) as NuxtPlugin
