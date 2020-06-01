import { Plugin as NuxtPlugin } from '@nuxt/types'
import { ReCaptcha } from '@/services/recaptcha/Recaptcha'

export default (({ app }, inject) => {
  const { RECAPTCHA_SITE_KEY, RECAPTCHA_VERSION } = app.$env
  const options = {
    hideBadge: true,
    siteKey: RECAPTCHA_SITE_KEY,
    version: parseInt(RECAPTCHA_VERSION),
    language: 'en',
    size: null,
  }

  inject('recaptcha', new ReCaptcha(options))
}) as NuxtPlugin
