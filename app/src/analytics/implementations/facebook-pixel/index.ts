import * as listeners from '../../event-listeners/facebook-pixel'
import { AnalyticsEventManager } from '../../event-manager/AnalyticsEventManager'
import * as EventTypes from '../../event-listeners/event-key'
import { facebookPixelSetup } from './facebook-pixel-sdk'

export class FacebookPixel {
  private static instance: FacebookPixel

  private trackingEnable: boolean

  private trackingLogEnable: boolean

  private id: string

  private fbq: any

  private fbqPromise: Promise<any>

  private constructor() {}

  public static getInstance() {
    if (!FacebookPixel.instance) {
      FacebookPixel.instance = new FacebookPixel()
    }
    return FacebookPixel.instance
  }

  public init(payload: InitPayload) {
    if (payload.trackingEnable && !payload.id) {
      throw new Error('FacebookPixel error: No Facebook Pixel id')
    }

    const { trackingEnable, trackingLogEnable, id } = payload
    this.trackingEnable = trackingEnable
    this.trackingLogEnable = trackingLogEnable
    this.id = id

    this.setup()
  }

  public async pageView() {
    const fbq = await this.getFbq()
    fbq('track', 'PageView')
  }

  private async getFbq() {
    if (this.fbq) return this.fbq

    if (this.fbqPromise) return this.fbqPromise

    this.fbqPromise = facebookPixelSetup(
      this.trackingEnable,
      this.trackingLogEnable
    )
    this.fbq = await this.fbqPromise
    this.fbq('init', this.id)

    return this.fbq
  }

  private setup() {
    const AEM = AnalyticsEventManager.getInstance()

    AEM.subscribe(EventTypes.PAGE_VIEW, listeners.pageView)
  }
}

interface InitPayload {
  trackingEnable: boolean
  trackingLogEnable: boolean
  id: string
}
