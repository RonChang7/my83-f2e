import * as listeners from '../../event-listeners/google-tag-manager'
import { AnalyticsEventManager } from '../../event-manager/AnalyticsEventManager'
import { EventTypes } from '../../event-listeners/event.type'

export class GoogleTagManager {
  private static instance: GoogleTagManager

  private trackingEnable: boolean

  private trackingLogEnable: boolean

  private id: string

  private constructor() {}

  public static getInstance() {
    if (!GoogleTagManager.instance) {
      GoogleTagManager.instance = new GoogleTagManager()
    }

    return GoogleTagManager.instance
  }

  public init(payload: InitPayload) {
    if (payload.trackingEnable && !payload.id) {
      throw new Error('GoogleTagManager error: No GTM id')
    }

    const { trackingEnable, trackingLogEnable, id } = payload
    this.trackingEnable = trackingEnable
    this.trackingLogEnable = trackingLogEnable
    this.id = id

    this.injectGtmScript()
    this.setup()
  }

  public pageView() {
    this.pushToDataLayer({
      event: 'pageview',
      page:
        window.location.pathname +
        window.location.search +
        window.location.hash,
    })
  }

  public set(payload: SetPayload) {
    this.pushToDataLayer({
      event: 'set',
      fieldName: payload.fieldName,
      fieldValue: payload.fieldValue,
    })
  }

  public event(payload: EventPayload) {
    this.pushToDataLayer({
      event: 'event',
      eventCategory: payload.eventCategory,
      eventAction: payload.eventAction,
      eventLabel: payload.eventLabel,
      eventValue: payload.eventValue,
    })
  }

  private injectGtmScript() {
    if (!this.trackingEnable) return

    const gtmInject = (window as any)._gtm_inject
    if (gtmInject) {
      gtmInject(this.id)
      console.log('GTM script injected by GoogleTagManager class:', this.id)
    } else {
      console.error('GTM inject function not found')
    }
  }

  private pushToDataLayer(data: any) {
    if (this.trackingEnable) {
      (window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push(data)
      if (this.trackingLogEnable) {
        console.log('GTM Data Layer Push:', data)
      }
    }
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
