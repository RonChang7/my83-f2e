import { UA } from 'nuxt-user-agent/lib/plugin.template'
/**
 * Extends types in Vue and Nuxt
 */
declare module 'vue/types/vue' {
  interface Vue {
    $analytics: <P>(eventName, payload?: P) => void
    readonly $ua: UA
    readonly $env: Record<string, any>
  }
}
declare module '@nuxt/types' {
  interface Context {
    $analytics: <P>(eventName, payload?: P) => void
    readonly $ua: UA
    readonly $env: Record<string, any>
  }

  interface NuxtAppOptions {
    $analytics: <P>(eventName, payload?: P) => void
    readonly $ua: UA
    readonly $env: Record<string, any>
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $analytics: <P>(eventName, payload?: P) => void
    readonly $ua: UA
  }
}
