import { Plugin as NuxtPlugin } from '@nuxt/types'

// 嫌疑犯用 Cookies key
export const enum SuspectKey {
  ROLE = 'role',
  MEMBER_ID = 'member_id',
}

export default (({ app }, inject) => {
  // Set cookies key to global
  const cookiesKeyMap: CookiesKey = {
    ROLE: SuspectKey.ROLE,
    MEMBER_ID: SuspectKey.MEMBER_ID,
    JWT: app.$env.JWT_TOKEN_NAME,
  }
  inject('cookiesKey', cookiesKeyMap)
}) as NuxtPlugin

export interface CookiesKey {
  ROLE: string
  MEMBER_ID: string
  JWT: string
}
