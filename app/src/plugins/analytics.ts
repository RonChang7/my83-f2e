import { Plugin as NuxtPlugin } from '@nuxt/types'
import { AnalyticsEventManager } from '@/analytics/event-manager/AnalyticsEventManager'
import { FacebookPixel } from '@/analytics/implementations/facebook-pixel'
import { GoogleTagManager } from '~/analytics/implementations/google-tag-manager'

export default (({ app }, inject) => {
  const {
    APP_ENV,
    TRACKING_ENABLE,
    TRACKING_DEV_LOG_ENABLE,
    FACEBOOK_PIXEL_IDS,
    GOOGLE_TAG_MANAGER_ID,
  } = app.$env

  const facebook = FacebookPixel.getInstance()
  const googleTagManager = GoogleTagManager.getInstance()

  const trackingLogEnable =
    TRACKING_DEV_LOG_ENABLE === 'true' && APP_ENV !== 'production'
  const trackingEnable = TRACKING_ENABLE === 'true'

  facebook.init({
    trackingLogEnable,
    trackingEnable,
    ids: FACEBOOK_PIXEL_IDS.split(',').map((e) => e.trim()),
  })

  googleTagManager.init({
    trackingLogEnable,
    trackingEnable,
    id: GOOGLE_TAG_MANAGER_ID,
  })

  const AEM = AnalyticsEventManager.getInstance()

  inject('analytics', AEM)
}) as NuxtPlugin
