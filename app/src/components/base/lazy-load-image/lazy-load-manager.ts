export class LazyLoadManager {
  private static instance: LazyLoadManager

  private static idSeed: number = 0

  private observer: IntersectionObserver

  private handlers: IntersectionHandlerMap

  private constructor() {
    this.handlers = {}
    this.observer = new IntersectionObserver(
      this.handleIntersectionChange.bind(this),
      {
        rootMargin: '150px',
      }
    )
  }

  public static getInstance(): LazyLoadManager {
    if (!LazyLoadManager.instance) {
      LazyLoadManager.instance = new LazyLoadManager()
    }

    return LazyLoadManager.instance
  }

  public regist(el: HTMLElement, handler: IntersectionHandler): string {
    const key = `lazy-load-${LazyLoadManager.idSeed++}`

    el.__lazyLoadKey__ = key
    this.handlers[key] = handler
    this.observer.observe(el)

    return key
  }

  public unregist(el: HTMLElement): string | void {
    if (!el.__lazyLoadKey__) return

    const key = el.__lazyLoadKey__
    if (!Object.prototype.hasOwnProperty.call(this.handlers, key)) return

    this.observer.unobserve(el)
    delete this.handlers[key]
    delete el.__lazyLoadKey__

    return key
  }

  private handleIntersectionChange(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      const el: HTMLElement = <HTMLElement>entry.target
      if (!el) return

      const key = el.__lazyLoadKey__
      if (!key) return

      const handler = this.handlers[key]
      if (!handler || typeof handler !== 'function') return

      handler(entry)
    })
  }
}

type IntersectionHandlerMap = { [key: string]: IntersectionHandler }
type IntersectionHandler = (entry: IntersectionObserverEntry) => void

declare global {
  interface HTMLElement {
    __lazyLoadKey__?: string
  }
}
