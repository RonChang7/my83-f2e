import { Plugin as NuxtPlugin } from '@nuxt/types'
import { CookiesKey } from './cookies'
import { Auth } from '@/services/auth/auth'

export default (({ app }, inject) => {
  const suspectStoreKeyMap: Partial<CookiesKey> = {
    ROLE: app.$cookiesKey.ROLE,
    MEMBER_ID: app.$cookiesKey.MEMBER_ID,
  }

  const auth = new Auth({
    jwtTokenKey: app.$cookiesKey.JWT,
    store: app.$cookies,
    suspectStoreKeyMap,
  })
  inject('auth', auth)
}) as NuxtPlugin
