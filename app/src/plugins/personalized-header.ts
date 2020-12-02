import { Plugin as NuxtPlugin } from '@nuxt/types'
import { FETCH_HEADER_PERSONALIZED_DATA } from '@/store/header/header.type'
import { EventTypes } from '@/analytics/event-listeners/event.type'
import { GlobalVuexState } from '@/store/global-state'

export default (({ app, store }) => {
  app.router!.afterEach(async () => {
    if (app.$auth.isLogin) {
      await store.dispatch(`header/${FETCH_HEADER_PERSONALIZED_DATA}`)

      const userId = (store.state as GlobalVuexState).header.headerPersonalized!
        .personalize.id

      // Update user ID for Sentry
      app.$sentry.setUser({ id: String(userId) })

      app.$analytics.dispatch<EventTypes.SetUserId>(EventTypes.SetUserId, {
        userId,
      })
    }

    const roleCode = app.$auth.userState.roleCode
    const role = roleCode === -1 ? '訪客' : roleCode // MY83-rt 舊有邏輯

    app.$analytics.dispatch<EventTypes.SetRole>(EventTypes.SetRole, { role })

    app.$analytics.dispatch<EventTypes.PageView>(EventTypes.PageView, null)
  })
}) as NuxtPlugin
