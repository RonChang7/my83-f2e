import { UA } from 'nuxt-user-agent/lib/plugin.template'
import { AnalyticsEventManager } from '@/analytics/event-manager/AnalyticsEventManager'
import { ReCaptchaInstance } from '@/services/recaptcha'
import '@nuxtjs/sentry'

/**
 * Extends types in Vue and Nuxt
 */
declare module 'vue/types/vue' {
  interface Vue {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
  }
}
declare module '@nuxt/types' {
  interface Context {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
  }

  interface NuxtAppOptions {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
  }
}
