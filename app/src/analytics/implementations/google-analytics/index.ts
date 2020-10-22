import 'autotrack'
import * as listeners from '../../event-listeners/google-analytics'
import { AnalyticsEventManager } from '../../event-manager/AnalyticsEventManager'
import { EventTypes } from '../../event-listeners/event.type'
import { googleAnalyticsSetup } from './google-analytics-sdk'

export class GoogleAnalytics {
  private static instance: GoogleAnalytics

  private trackingEnable: boolean

  private trackingLogEnable: boolean

  private id: string

  private ga: any

  private gaPromise: Promise<any>

  private constructor() {}

  public static getInstance() {
    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics()
    }

    return GoogleAnalytics.instance
  }

  public init(payload: InitPayload) {
    if (payload.trackingEnable && !payload.id) {
      throw new Error('GoogleAnalytics error: No Facebook Pixel id')
    }

    const { trackingEnable, trackingLogEnable, id } = payload
    this.trackingEnable = trackingEnable
    this.trackingLogEnable = trackingLogEnable
    this.id = id

    this.setup()
  }

  public async pageView() {
    const ga = await this.getGa()

    ga(
      'send',
      'pageview',
      window.location.pathname + window.location.search + window.location.hash
    )
  }

  public async set(payload: SetPayload) {
    const ga = await this.getGa()
    const { fieldName, fieldValue } = payload

    ga('set', fieldName, fieldValue)
  }

  public async event(payload: EventPayload) {
    const ga = await this.getGa()

    ga(
      'send',
      'event',
      payload.eventCategory,
      payload.eventAction,
      payload.eventLabel,
      payload.eventValue
    )
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

  private setup() {
    const AEM = AnalyticsEventManager.getInstance()

    AEM.subscribe<EventTypes.SetRole>(EventTypes.SetRole, listeners.setRole)
    AEM.subscribe<EventTypes.SetUserId>(
      EventTypes.SetUserId,
      listeners.setUserId
    )
    AEM.subscribe<EventTypes.PageView>(EventTypes.PageView, listeners.pageView)
    AEM.subscribe<EventTypes.ClickAction>(
      EventTypes.ClickAction,
      listeners.clickAction
    )
  }
}

interface InitPayload {
  trackingEnable: boolean
  trackingLogEnable: boolean
  id: string
}

// Ref: https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#set
interface SetPayload {
  fieldName: string
  fieldValue: string
}

interface EventPayload {
  eventCategory: string
  eventAction: string
  eventLabel?: string
  eventValue?: number
}
