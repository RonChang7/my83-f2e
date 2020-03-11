import { Plugin as NuxtPlugin } from '@nuxt/types'
import { FETCH_HEADER_PERSONALIZED_DATA } from '@/store/header/header.type'
import { User } from '@/services/user/user'

export default (({ app, store }) => {
  if (process.client) {
    app.router!.beforeEach((to, from, next) => {
      const user = User.getInstance()
      if (user.isLogin()) {
        store.dispatch(`header/${FETCH_HEADER_PERSONALIZED_DATA}`)
      }
      next()
    })
  }
}) as NuxtPlugin
