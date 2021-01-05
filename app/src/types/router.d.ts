import { NuxtRouteConfig } from '@nuxt/types/config/router'

export interface RouteConfig extends NuxtRouteConfig {
  meta?: {
    [x: string]: any
    pageType?: string
    hideFooter?: boolean
    showScrollToTop?: ShowScrollToTop
    requiredStoreModules?: string[]
  }
}

type ShowScrollToTop =
  | boolean
  | {
      desktop?: boolean
      mobile?: boolean
    }
