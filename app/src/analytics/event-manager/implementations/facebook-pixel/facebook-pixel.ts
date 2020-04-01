import * as eventTypes from '../../event-key'
import { facebookPixelSetup } from '../facebook-pixel/facebook-pixel-sdk'

export class FacebookPixel {
  private static instance: FacebookPixel

  private trackingEnable: boolean

  private trackingLogEnable: boolean

  private id: string

  private fbq: any

  private fbqPromise: Promise<any>

  private constructor(payload: InstantPayload) {
    const { trackingEnable, trackingLogEnable, id } = payload
    this.trackingEnable = trackingEnable
    this.trackingLogEnable = trackingLogEnable
    this.id = id
  }

  public static getInstance(payload: InstantPayload) {
    if (payload.trackingEnable && !payload.id) {
      throw new Error('FacebookPixel error: No Facebook Pixel id')
    }

    if (!FacebookPixel.instance) {
      FacebookPixel.instance = new FacebookPixel(payload)
    }

    return FacebookPixel.instance
  }

  public async [eventTypes.PAGE_VIEW]() {
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
}

interface InstantPayload {
  trackingEnable: boolean
  trackingLogEnable: boolean
  id: string
}
