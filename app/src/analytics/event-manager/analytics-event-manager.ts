import _ from 'lodash'
import { FacebookPixel } from './implementations/facebook-pixel/facebook-pixel'
import { GoogleAnalytics } from './implementations/google-analytics/google-analytics'
import * as eventTypes from './event-key'

export class AnalyticsEventManager {
  private static instance: AnalyticsEventManager

  private static eventProviders: Record<EventProvider, any> = {
    facebookPixel: FacebookPixel,
    googleAnalytics: GoogleAnalytics,
  }

  private eventProvidersInstance: Record<EventProvider, any> | {} = {}

  private trackingEnable: boolean

  private trackingLogEnable: boolean

  private env: EventProviderEnv

  private constructor({
    trackingEnable,
    trackingLogEnable,
    env,
  }: ConstructPayload) {
    this.trackingEnable = trackingEnable
    this.trackingLogEnable = trackingLogEnable
    this.env = env

    try {
      this.setup()
    } catch (e) {
      console.warn('AEM setup error: ', e)
    }
  }

  public static getInstance(payload: ConstructPayload) {
    if (!AnalyticsEventManager.instance) {
      if (payload.trackingEnable && !payload.env) {
        console.warn('AEM error: No environment variable')
      }

      AnalyticsEventManager.instance = new AnalyticsEventManager(payload)
    }

    return AnalyticsEventManager.instance
  }

  public trigger<P>(eventName, payload?: P) {
    if (process.server) return

    _.forIn(
      this.eventProvidersInstance as EventProviderEnv,
      async (eventProviderInstance) => {
        try {
          await eventProviderInstance[eventTypes[eventName]](payload)
        } catch (e) {
          console.warn('AEM trigger error: ', e)
        }
      }
    )
  }

  private setup() {
    _.forIn(AnalyticsEventManager.eventProviders, (eventProvider, key) => {
      if (typeof eventProvider === 'function') {
        this.eventProvidersInstance[key] = eventProvider.getInstance({
          trackingEnable: this.trackingEnable,
          trackingLogEnable: this.trackingLogEnable,
          id: this.env[key].id,
        })
      }
    })
  }
}

export type EventProviderEnv = Record<EventProvider, EventSettings>

type EventProvider = 'facebookPixel' | 'googleAnalytics'

interface EventSettings {
  id: string
}

interface ConstructPayload {
  trackingEnable: boolean
  trackingLogEnable: boolean
  env: EventProviderEnv
}
