import { getScrollContainer, getCoords, getScroll } from './dom'
const isServer = typeof window === 'undefined'

const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t + b
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

const scrollTo = (
  target: HTMLElement | Window,
  to: number,
  vertical: boolean
): void => {
  if (isServer) return

  if (target === window) {
    if (vertical) {
      target.scrollTo(target.pageXOffset, to)
    } else {
      target.scrollTo(to, target.pageYOffset)
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (vertical) {
      ;(target as HTMLElement).scrollTop = to
    } else {
      ;(target as HTMLElement).scrollLeft = to
    }
  }
}

const animationScrollTo = (
  container: HTMLElement | Window,
  vertical: boolean,
  currentTime: number,
  increment: number,
  start: number,
  change: number,
  duration: number,
  callback?: () => void
) => {
  currentTime += increment
  const val = easeInOutQuad(currentTime, start, change, duration)

  scrollTo(container, val, vertical)

  if (currentTime < duration) {
    window.requestAnimationFrame(() =>
      animationScrollTo(
        container,
        vertical,
        currentTime,
        increment,
        start,
        change,
        duration,
        callback
      )
    )
  } else {
    typeof callback === 'function' && callback()
  }
}

export const scrollToPosition = (option: Option, callback?: () => void) => {
  const _opt = { ...option }
  typeof _opt.duration === 'undefined' && (_opt.duration = 200)
  const start = getScroll(_opt.container, _opt.vertical) as number
  const change = _opt.to - start

  animationScrollTo(
    _opt.container,
    _opt.vertical,
    0,
    20,
    start,
    change,
    _opt.duration,
    callback
  )
}

interface Option {
  to: number
  container: HTMLElement | Window
  vertical: boolean
  duration?: number
}

export const scrollToElement = (option: Option2, callback?: () => void) => {
  const _opt = { ...option }
  typeof _opt.offset === 'undefined' && (_opt.offset = 0)

  const el = _opt.el
  if (!el) return

  const container = getScrollContainer(el, _opt.vertical)
  if (!container) return

  const coords = getCoords(el, container)!

  const to = (_opt.vertical ? coords.top : coords.left) - _opt.offset

  scrollToPosition(
    {
      to,
      container,
      vertical: _opt.vertical,
      duration: _opt.duration,
    },
    callback
  )
}

interface Option2 {
  el: HTMLElement
  container?: HTMLElement | Window
  vertical: boolean
  duration?: number
  offset?: number
}
