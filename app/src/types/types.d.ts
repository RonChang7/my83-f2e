import { UA } from 'nuxt-user-agent/lib/plugin.template'
import { AnalyticsEventManager } from '@/analytics/event-manager/AnalyticsEventManager'
import '@nuxtjs/recaptcha'

/**
 * Extends types in Vue and Nuxt
 */
declare module 'vue/types/vue' {
  interface Vue {
    $analytics: AnalyticsEventManager
    readonly $ua: UA
    readonly $env: Record<string, any>
  }
}
declare module '@nuxt/types' {
  interface Context {
    $analytics: AnalyticsEventManager
    readonly $ua: UA
    readonly $env: Record<string, any>
  }

  interface NuxtAppOptions {
    $analytics: AnalyticsEventManager
    readonly $ua: UA
    readonly $env: Record<string, any>
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $analytics: AnalyticsEventManager
    readonly $ua: UA
  }
}

/**
 * @TODO: 暫時修正新版 Nuxt 沒有 fetch type 的 issue
 * https://github.com/nuxt/typescript/blob/master/packages/types/app/vue.d.ts
 */
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    fetchDelay?: number
    fetchOnServer?: boolean | (() => boolean)
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $fetchState: {
      error: Error | null
      pending: boolean
      timestamp: number
    }
    $fetch(): void
  }
}
