import { UA } from 'nuxt-user-agent/lib/plugin.template'
import { AnalyticsEventManager } from '@/analytics/event-manager/AnalyticsEventManager'
import { ReCaptchaInstance } from '@/services/recaptcha'
import { CookiesKey } from '@/plugins/cookies'
import { Auth } from '@/services/auth/auth'
import '@nuxtjs/sentry'
import 'cookie-universal-nuxt'

/**
 * Extends types in Vue and Nuxt
 */
declare module 'vue/types/vue' {
  interface Vue {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
    readonly $cookiesKey: CookiesKey
    readonly $auth: Auth
  }
}
declare module '@nuxt/types' {
  interface Context {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
    readonly $cookiesKey: CookiesKey
    readonly $auth: Auth
  }

  interface NuxtAppOptions {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
    readonly $cookiesKey: CookiesKey
    readonly $auth: Auth
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
    readonly $cookiesKey: CookiesKey
    readonly $auth: Auth
  }
}
