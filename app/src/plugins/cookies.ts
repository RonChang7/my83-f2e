import { Plugin as NuxtPlugin } from '@nuxt/types'

// 嫌疑犯用 Cookies key
export const enum SuspectKey {
  ROLE = 'role',
  MEMBER_ID = 'member_id',
}

export const LastUpdateActiveSalesCount = 'last_update_active_sales_count'

export default (({ app }, inject) => {
  // Set cookies key to global
  const cookiesKeyMap: CookiesKey = {
    ROLE: SuspectKey.ROLE,
    MEMBER_ID: SuspectKey.MEMBER_ID,
    JWT: app.$env.JWT_TOKEN_NAME,
    LAST_UPDATE_ACTIVE_SALES_COUNT: LastUpdateActiveSalesCount,
  }
  inject('cookiesKey', cookiesKeyMap)
}) as NuxtPlugin

export interface CookiesKey {
  ROLE: string
  MEMBER_ID: string
  JWT: string
  LAST_UPDATE_ACTIVE_SALES_COUNT: string
}
