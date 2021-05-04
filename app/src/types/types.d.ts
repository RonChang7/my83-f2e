import { UA } from 'nuxt-user-agent/lib/plugin.template'
import { AnalyticsEventManager } from '@/analytics/event-manager/AnalyticsEventManager'
import { ReCaptchaInstance } from '@/services/recaptcha'
import { Auth } from '@/services/auth/auth'
import 'cookie-universal-nuxt'
import { Notyf } from 'notyf'

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
    readonly $auth: Auth
    readonly $notification: Notyf
  }
}
declare module '@nuxt/types' {
  interface Context {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
    readonly $auth: Auth
    readonly $notification: Notyf
  }

  interface NuxtAppOptions {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
    readonly $auth: Auth
    readonly $notification: Notyf
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $analytics: AnalyticsEventManager
    $recaptcha: ReCaptchaInstance
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
    readonly $auth: Auth
    readonly $notification: Notyf
  }
}
