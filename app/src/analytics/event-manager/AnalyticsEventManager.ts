import EventEmitter from 'eventemitter3'

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

  public subscribe<P>(event: string, handler: Handler<P>) {
    this.observer.on(event, handler)
  }

  public dispatch<P>(event: string, payload?: P) {
    this.observer.emit(event, payload)
  }
}

type Handler<P> = (payload: P) => void
