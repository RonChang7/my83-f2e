import EventEmitter from 'eventemitter3'
import { Payloads, Handlers, EventTypes } from '../event-listeners/event.type'

export class AnalyticsEventManager {
  private static instance: AnalyticsEventManager

  private observer: EventEmitter

  private constructor() {
    this.observer = new EventEmitter()
  }

  public static getInstance() {
    if (!AnalyticsEventManager.instance) {
      AnalyticsEventManager.instance = new AnalyticsEventManager()
    }
    return AnalyticsEventManager.instance
  }

  public subscribe<P extends EventTypes>(event: string, handler: Handlers[P]) {
    this.observer.on(event, handler)
  }

  public dispatch<P extends EventTypes>(event: string, payload?: Payloads[P]) {
    this.observer.emit(event, payload)
  }
}
