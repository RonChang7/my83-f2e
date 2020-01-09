import { UA } from 'node_modules/nuxt-user-agent/lib/plugin.template'
/**
 * Extends types in Vue and Nuxt
 */
declare module 'vue/types/vue' {
  interface Vue {
    readonly $ua: UA
  }
}

declare module '@nuxt/types' {
  interface Context {
    $ua: UA
  }

  interface NuxtAppOptions {
    readonly $ua: UA
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    readonly $ua: UA
  }
}
