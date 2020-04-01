import { easeInOutCubic } from './math'

export function getScroll(
  target: HTMLElement | Window | null,
  top: boolean
): number {
  if (typeof window === 'undefined') {
    return 0
  }

  const prop = top ? 'pageYOffset' : 'pageXOffset'
  const method = top ? 'scrollTop' : 'scrollLeft'
  const isWindow = target === window

  let ret = isWindow
    ? (target as Window)[prop]
    : (target as HTMLElement)[method]
  // ie6,7,8 standard mode
  if (isWindow && typeof ret !== 'number') {
    ret = (document.documentElement as HTMLElement)[method]
  }

  return ret
}

export function scrollTo(
  target: HTMLElement,
  container: HTMLElement | Window,
  offsetTop = 0,
  callback = () => {}
) {
  if (!target) return
  if (!container) return

  const scrollTop = getScroll(container, true)
  const eleOffsetTop = getOffsetTop(target, container)
  const targetScrollTop = scrollTop + eleOffsetTop - offsetTop
  const startTime = Date.now()
  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(time, scrollTop, targetScrollTop, 450)
    if (container === window) {
      window.scrollTo(window.pageXOffset, nextScrollTop)
    } else {
      ;(container as HTMLElement).scrollTop = nextScrollTop
    }
    if (time < 450) {
      window.requestAnimationFrame(frameFunc)
    } else {
      callback()
    }
  }
  window.requestAnimationFrame(frameFunc)
}

export function getOffsetTop(
  element: HTMLElement,
  container: HTMLElement | Window
): number {
  if (!element) {
    return 0
  }

  if (!element.getClientRects().length) {
    return 0
  }

  const rect = element.getBoundingClientRect()

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument!.documentElement!
      return rect.top - container.clientTop
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top
  }

  return rect.top
}
