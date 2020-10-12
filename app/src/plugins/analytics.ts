import { Plugin as NuxtPlugin } from '@nuxt/types'
import { AnalyticsEventManager } from '@/analytics/event-manager/AnalyticsEventManager'
import { FacebookPixel } from '@/analytics/implementations/facebook-pixel'
import { GoogleAnalytics } from '@/analytics/implementations/google-analytics'

export default (({ app }, inject) => {
  const {
    APP_ENV,
    TRACKING_ENABLE,
    TRACKING_DEV_LOG_ENABLE,
    FACEBOOK_PIXEL_ID,
    GOOGLE_ANALYTICS_ID,
  } = app.$env

  const facebook = FacebookPixel.getInstance()
  const googleAnalytics = GoogleAnalytics.getInstance()

  const trackingLogEnable =
    TRACKING_DEV_LOG_ENABLE === 'true' && APP_ENV !== 'production'
  const trackingEnable = TRACKING_ENABLE === 'true'

  facebook.init({
    trackingLogEnable,
    trackingEnable,
    ids: FACEBOOK_PIXEL_ID.split(','),
  })

  googleAnalytics.init({
    trackingLogEnable,
    trackingEnable,
    id: GOOGLE_ANALYTICS_ID,
  })

  const AEM = AnalyticsEventManager.getInstance()

  inject('analytics', AEM)
}) as NuxtPlugin
