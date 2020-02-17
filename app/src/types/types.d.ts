import { UA } from 'nuxt-user-agent/lib/plugin.template'
/**
 * Extends types in Vue and Nuxt
 */
declare module 'vue/types/vue' {
  interface Vue {
    readonly $ua: UA
    readonly $env: Record<string, any>
  }
}
declare module '@nuxt/types' {
  interface Context {
    $ua: UA
    readonly $env: Record<string, any>
  }

  interface NuxtAppOptions {
    readonly $ua: UA
    readonly $env: Record<string, any>
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    readonly $ua: UA
  }
}
