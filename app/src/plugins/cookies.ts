import { Plugin as NuxtPlugin } from '@nuxt/types'
import { Auth } from '@/services/auth/auth'
import { Suspect } from '@/services/auth/suspect'

// 嫌疑犯用 Cookies key
const enum SuspectKey {
  ROLE = 'role',
  MEMBER = 'member',
}

export default (({ app }, inject) => {
  // Set cookies key to global
  const cookiesKeyMap: CookiesKey = {
    ROLE: SuspectKey.ROLE,
    MEMBER: SuspectKey.MEMBER,
    JWT: app.$env.JWT_TOKEN_NAME,
  }
  inject('cookiesKey', cookiesKeyMap)

  const auth = Auth.getInstance()
  // Set my83 cookies handler
  auth.setStore(app.$cookies)
  // Set my83 token name
  auth.setTokenKey(app.$cookiesKey.JWT)

  const suspect = Suspect.getInstance()
  // Set my83 cookies handler
  suspect.setStore(app.$cookies)
}) as NuxtPlugin

export interface CookiesKey {
  ROLE: string
  MEMBER: string
  JWT: string
}
