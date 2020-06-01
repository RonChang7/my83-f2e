import { resolve } from 'path'
import { Module } from '@nuxt/types'
import { ReCaptchaOptions } from '@nuxtjs/recaptcha'

const RecaptchaModule: Module<ReCaptchaOptions> = function() {
  const options = {
    hideBadge: true,
    siteKey: process.env.RECAPTCHA_SITE_KEY,
    version: parseInt(process.env.RECAPTCHA_VERSION!),
  }

  const modulePath = 'node_modules/@nuxtjs/recaptcha/lib'

  this.addPlugin({
    fileName: 'recaptcha.js',
    options,
    src: resolve(modulePath, 'plugin.js'),
  })

  this.addTemplate({
    fileName: 'recaptcha.vue',
    src: resolve(modulePath, 'recaptcha.vue'),
  })
}

export default RecaptchaModule
