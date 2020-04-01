import 'autotrack'
import * as eventTypes from '../../event-key'
import { googleAnalyticsSetup } from '../google-analytics/google-analytics-sdk'
import { GoogleTrackingSetPayload } from '../../event-payload-interface'

export class GoogleAnalytics {
  private static instance: GoogleAnalytics

  private trackingEnable: boolean

  private trackingLogEnable: boolean

  private id: string

  private ga: any

  private gaPromise: Promise<any>

  private constructor(payload: InstantPayload) {
    const { trackingEnable, trackingLogEnable, id } = payload
    this.trackingEnable = trackingEnable
    this.trackingLogEnable = trackingLogEnable
    this.id = id
  }

  public static getInstance(payload: InstantPayload) {
    if (payload.trackingEnable && !payload.id) {
      throw new Error('GoogleAnalytics error: No Facebook Pixel id')
    }

    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics(payload)
    }

    return GoogleAnalytics.instance
  }

  public async [eventTypes.PAGE_VIEW]() {
    const ga = await this.getGa()

    ga(
      'send',
      'pageview',
      window.location.pathname + window.location.search + window.location.hash
    )
  }

  public async [eventTypes.GOOGLE_TRACKING_SET](
    payload: GoogleTrackingSetPayload
  ) {
    const ga = await this.getGa()
    const { fieldName, fieldValue } = payload

    ga('set', fieldName, fieldValue)
  }

  private async getGa() {
    if (this.ga) return this.ga

    if (this.gaPromise) return this.gaPromise

    this.gaPromise = googleAnalyticsSetup(
      this.trackingEnable,
      this.trackingLogEnable
    )
    this.ga = await this.gaPromise

    this.ga('create', this.id, 'auto')
    this.ga('require', 'cleanUrlTracker')
    this.ga('require', 'eventTracker')
    this.ga('require', 'impressionTracker')
    this.ga('require', 'maxScrollTracker')
    this.ga('require', 'mediaQueryTracker')
    this.ga('require', 'outboundFormTracker')
    this.ga('require', 'outboundLinkTracker')
    this.ga('require', 'pageVisibilityTracker')
    this.ga('require', 'socialWidgetTracker')
    this.ga('require', 'urlChangeTracker')

    return this.ga
  }
}

interface InstantPayload {
  trackingEnable: boolean
  trackingLogEnable: boolean
  id: string
}
