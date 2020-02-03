// API file: https://api.zopim.com/
export default () =>
  new Promise((resolve) => {
    ;(function(d, s, id) {
      const z = (window.$zopim = function(c) {
        z._.push(c)
      })
      const $ = (z.s = d.createElement(s))
      const e = d.getElementsByTagName(s)[0]
      z.set = function(o) {
        z.set._.push(o)
      }
      z._ = []
      z.set._ = []
      $.async = !0
      $.setAttribute('charset', 'utf-8')
      $.src = 'https://v2.zopim.com/?' + id
      z.t = +new Date()
      $.type = 'text/javascript'
      e.parentNode.insertBefore($, e)
      $.onload = () => {
        resolve()
      }
    })(document, 'script', process.env.ZENDESK_CHAT_ID)
  })
