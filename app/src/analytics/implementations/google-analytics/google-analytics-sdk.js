/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
import { logger } from '../../helper/logger'

export const googleAnalyticsSetup = (trackingEnable, trackingLogEnable) => {
  return new Promise((resolve) => {
    if (trackingEnable) {
      ;(function(i, s, o, g, r, a, m) {
        // eslint-disable-next-line dot-notation
        i['GoogleAnalyticsObject'] = r
        ;(i[r] =
          i[r] ||
          function() {
            ;(i[r].q = i[r].q || []).push(arguments)
          }),
          (i[r].l = 1 * new Date())
        ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
        a.async = 1
        a.src = g
        m.parentNode.insertBefore(a, m)

        a.onload = () =>
          resolve((...args) => {
            window.ga(...args)
            if (trackingLogEnable) {
              logger('[Google Analytics]', args.join(' '))
            }
          })
      })(
        window,
        document,
        'script',
        'https://www.google-analytics.com/analytics.js',
        'ga'
      )
    } else {
      resolve((...args) => {
        if (trackingLogEnable) {
          logger('[Google Analytics]', args.join(' '))
        }
      })
    }
  })
}
