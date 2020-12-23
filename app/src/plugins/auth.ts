import { Plugin as NuxtPlugin } from '@nuxt/types'
import { Auth } from '@/services/auth/auth'

export default (({ app }, inject) => {
  const auth = new Auth({
    jwtTokenKey: app.$env.JWT_TOKEN_NAME,
    store: app.$cookies,
  })
  inject('auth', auth)
}) as NuxtPlugin
