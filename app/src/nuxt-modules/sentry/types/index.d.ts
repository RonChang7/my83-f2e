import * as SentryTypes from '@sentry/minimal'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $sentry: typeof SentryTypes
  }
}
declare module '@nuxt/types' {
  interface Context {
    readonly $sentry: typeof SentryTypes
  }

  interface NuxtAppOptions {
    readonly $sentry: typeof SentryTypes
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    readonly $sentry: typeof SentryTypes
  }
}
