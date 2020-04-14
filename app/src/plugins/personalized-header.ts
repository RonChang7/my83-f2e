import { Plugin as NuxtPlugin } from '@nuxt/types'
import { FETCH_HEADER_PERSONALIZED_DATA } from '@/store/header/header.type'
import { User } from '@/services/user/user'
import { EventTypes } from '@/analytics/event-listeners/event.type'
import { GlobalVuexState } from '@/store/global-state'

export default (({ app, store }) => {
  app.router!.afterEach(async () => {
    const user = User.getInstance()
    if (user.isLogin()) {
      await store.dispatch(`header/${FETCH_HEADER_PERSONALIZED_DATA}`)

      const userId = (store.state as GlobalVuexState).header.headerPersonalized!
        .personalize.id

      app.$analytics.dispatch<EventTypes.SetUserId>(EventTypes.SetUserId, {
        userId,
      })
    }

    const { roleCode } = user.userState
    const role = roleCode === -1 ? '訪客' : roleCode // MY83-rt 舊有邏輯

    app.$analytics.dispatch<EventTypes.SetRole>(EventTypes.SetRole, { role })

    app.$analytics.dispatch<EventTypes.PageView>(EventTypes.PageView)
  })
}) as NuxtPlugin
