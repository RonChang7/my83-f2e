const _preservedBodyStyle: Partial<CSSStyleDeclaration> = {}
let _preservedScroll: number | null = null
let _currentStatus = false

export default function freezeWindowScroller(status) {
  if (status === _currentStatus) return

  const bodyEl = document.querySelectorAll('body')[0]

  if (status) {
    _currentStatus = true
    _preservedBodyStyle.position = bodyEl.style.position
    _preservedBodyStyle.width = bodyEl.style.width
    _preservedBodyStyle.top = bodyEl.style.top
    _preservedScroll = window.pageYOffset

    bodyEl.style.top = `-${_preservedScroll}px`
    bodyEl.style.position = 'fixed'
    bodyEl.style.width = '100%'
  } else {
    _currentStatus = false
    bodyEl.style.position = _preservedBodyStyle.position!
    bodyEl.style.width = _preservedBodyStyle.width!
    bodyEl.style.top = _preservedBodyStyle.top!

    if (_preservedScroll) {
      window.scrollTo(0, _preservedScroll)
    }
  }
}
