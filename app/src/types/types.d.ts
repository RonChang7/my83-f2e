import { UA } from 'nuxt-user-agent/lib/plugin.template'
import { AnalyticsEventManager } from '@/analytics/event-manager/AnalyticsEventManager'
import '@nuxtjs/recaptcha'
import '@nuxtjs/sentry'

/**
 * Extends types in Vue and Nuxt
 */
declare module 'vue/types/vue' {
  interface Vue {
    $analytics: AnalyticsEventManager
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
  }
}
declare module '@nuxt/types' {
  interface Context {
    $analytics: AnalyticsEventManager
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
  }

  interface NuxtAppOptions {
    $analytics: AnalyticsEventManager
    readonly $ua: UA
    readonly $env: Record<string, any>
    readonly $imageBucketUrl: string
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $analytics: AnalyticsEventManager
    readonly $ua: UA
    readonly $imageBucketUrl: string
  }
}
