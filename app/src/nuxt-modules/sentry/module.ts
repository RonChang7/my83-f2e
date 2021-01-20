import { defineNuxtModule } from '@nuxtjs/composition-api'
import { buildHook } from './core/hooks'

const Sentry = defineNuxtModule(function () {
  this.nuxt.hook('build:before', async () => await buildHook(this))
})

export default Sentry
