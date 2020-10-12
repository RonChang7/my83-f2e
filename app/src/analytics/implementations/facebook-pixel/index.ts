import * as listeners from '../../event-listeners/facebook-pixel'
import { AnalyticsEventManager } from '../../event-manager/AnalyticsEventManager'
import { EventTypes } from '../../event-listeners/event.type'
import { facebookPixelSetup } from './facebook-pixel-sdk'

type FBQ = any
export class FacebookPixel {
  private static instance: FacebookPixel

  private trackingEnable: boolean

  private trackingLogEnable: boolean

  private pixelIds: string[]

  private fbq: FBQ

  private fbqPromise: Promise<FBQ>

  private constructor() {}

  public static getInstance() {
    if (!FacebookPixel.instance) {
      FacebookPixel.instance = new FacebookPixel()
    }
    return FacebookPixel.instance
  }

  public init(payload: InitPayload) {
    if (payload.trackingEnable && !payload.ids) {
      throw new Error('FacebookPixel error: No Facebook Pixel id')
    }

    const { trackingEnable, trackingLogEnable, ids } = payload
    this.trackingEnable = trackingEnable
    this.trackingLogEnable = trackingLogEnable
    this.pixelIds = ids

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

    this.pixelIds.forEach((id) => {
      this.fbq('init', id)
    })

    return this.fbq
  }

  private setup() {
    const AEM = AnalyticsEventManager.getInstance()

    AEM.subscribe<EventTypes.PageView>(EventTypes.PageView, listeners.pageView)
  }
}

interface InitPayload {
  trackingEnable: boolean
  trackingLogEnable: boolean
  ids: string[]
}
