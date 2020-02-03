const whitespaceRE = /\s+/

export function normalizeStyleName(styleName: string): string {
  return (
    styleName
      // eslint-disable-next-line
      .replace(/([\:\-\_]+(.))/g, (_, separator, letter, offset) =>
        offset ? letter.toUpperCase() : letter
      )
      .replace(/^moz([A-Z])/, 'Moz$1')
  )
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
