const whitespaceRE = /\s+/
const isServer = typeof window === 'undefined'
const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

export function normalizeStyleName(name: string): string {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, _separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1')
}

/**
 * 取得 Dom 樣式的值
 * @param el 目標 Element
 * @param styleName 樣式名稱
 * @returns {void} 若在 server 呼叫，則不會做事
 * @returns {null} 沒有查到此樣式
 * @returns {String} 樣式值
 */
export const getStyle = (
  el: HTMLElement,
  styleName: string
): string | null | void => {
  if (isServer) return
  if (!el || !styleName) return null
  styleName = normalizeStyleName(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = window.getComputedStyle(el, '')
    return el.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return el.style[styleName]
  }
}

/**
 * 檢查是否有滾動
 * @param el 目標 Element
 * @param vertical 滾動方向是垂直？
 * @returns {void} 若在 server 呼叫，則不會做事
 * @returns {boolean}
 */
export const isScroll = (
  el: HTMLElement,
  vertical?: boolean
): boolean | void => {
  if (isServer) return

  const overflow =
    typeof vertical === 'boolean'
      ? vertical
        ? getStyle(el, 'overflow-y')
        : getStyle(el, 'overflow-x')
      : getStyle(el, 'overflow')

  if (!overflow) return false
  if (overflow === 'auto' && el.tagName === 'BODY') return false
  return !!overflow.match(/(scroll|auto)/)
}

/**
 * 取得滾動的容器
 * @param el 目標 Element
 * @param vertical 滾動方向是垂直？
 */
export const getScrollContainer = (
  el: HTMLElement,
  vertical?: boolean
): Window | HTMLElement | null | void => {
  if (isServer) return

  let parent: HTMLElement | null = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent as any)) {
      return window
    }
    if (isScroll(parent, vertical)) {
      return parent
    }
    parent = parent.parentNode as HTMLElement
  }

  return parent
}

export const getCoords = (el: HTMLElement, container: HTMLElement | Window) => {
  if (isServer) return

  if (container === window) {
    const doc = el.ownerDocument!.documentElement!
    const rect = el.getBoundingClientRect()

    const scrollTop = getScroll(container, true) as number
    const scrollLeft = getScroll(container, false) as number

    const clientTop = doc.clientTop
    const clientLeft = doc.clientLeft

    return {
      top: rect.top + scrollTop - clientTop,
      left: rect.left + scrollLeft - clientLeft,
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
    }
  }
}

export const getScroll = (
  target: HTMLElement | Window,
  vertical: boolean
): number | void => {
  if (isServer) return

  const prop = vertical ? 'pageYOffset' : 'pageXOffset'
  const method = vertical ? 'scrollTop' : 'scrollLeft'
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

export const checkHasScroll = (
  el: HTMLElement | Window,
  vertical: boolean
): boolean => {
  const _el = el === window ? document.documentElement : (el as HTMLElement)

  if (vertical) {
    return _el.scrollHeight > _el.clientHeight
  } else {
    return _el.scrollWidth > _el.clientWidth
  }
}

export const getRect = (target: HTMLElement | Window | null): ClientRect => {
  if (target === window) {
    return { top: 0, left: 0, bottom: 0 } as ClientRect
  }
  return (target as HTMLElement).getBoundingClientRect()
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

export function setStyle(
  el: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
) {
  if (!el || !styles) return

  Object.keys(styles).forEach((key) => {
    const value = styles[key]
    if (!value) return

    el.style[normalizeStyleName(key)] = value
  })
}

export function getClass(el: HTMLElement): string | null | void {
  if (!el) return

  if (el.classList && el.className) {
    return el.className
  }

  return el.getAttribute('class')
}

export function addClass(el: HTMLElement, cls: string) {
  if (!el) return
  if (!cls || !(cls = cls.trim())) return

  if (el.classList) {
    if (cls.includes(' ')) {
      cls.split(whitespaceRE).forEach((c) => el.classList.add(c))
    } else {
      el.classList.add(cls)
    }
  } else {
    const cur = ` ${el.getAttribute('class') || ''} `
    if (!cur.includes(' ' + cls + ' ')) {
      el.setAttribute('class', (cur + cls).trim())
    }
  }
}

export function removeClass(el: HTMLElement, cls: string) {
  if (!el) return
  if (!cls || !(cls = cls.trim())) return

  if (el.classList) {
    if (cls.includes(' ')) {
      cls.split(whitespaceRE).forEach((c) => el.classList.remove(c))
    } else {
      el.classList.remove(cls)
    }
    if (!el.classList.length) {
      el.removeAttribute('class')
    }
  } else {
    let cur = ` ${el.getAttribute('class') || ''} `
    const tar = ' ' + cls + ' '
    while (cur.includes(tar)) {
      cur = cur.replace(tar, ' ')
    }
    cur = cur.trim()
    if (cur) {
      el.setAttribute('class', cur)
    } else {
      el.removeAttribute('class')
    }
  }
}

export function hasClass(el: HTMLElement, cls: string): boolean {
  if (!el) return false
  if (!cls || !(cls = cls.trim())) return false
  if (cls.includes(' ')) throw new Error('className should not contain space.')

  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return ` ${el.getAttribute('class') || ''} `.includes(' ' + cls + ' ')
  }
}
