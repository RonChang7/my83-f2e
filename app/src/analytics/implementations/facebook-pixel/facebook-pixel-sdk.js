import { logger } from '../../helper/logger'

export const facebookPixelSetup = (trackingEnable, trackingLogEnable) => {
  return new Promise((resolve) => {
    if (trackingEnable) {
      // eslint-disable-next-line no-unused-expressions
      !(function(f, b, e, v, n, t, s) {
        if (f.fbq) return
        n = f.fbq = function() {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)

        t.onload = () =>
          resolve((...args) => {
            f.fbq(...args)
            if (trackingLogEnable) {
              logger('[Facebook Pixel]', args.join(' '))
            }
          })
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      )
    } else {
      resolve((...args) => {
        if (trackingLogEnable) {
          logger('[Facebook Pixel]', args.join(' '))
        }
      })
    }
  })
}
