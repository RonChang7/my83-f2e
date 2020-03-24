import { Plugin as NuxtPlugin } from '@nuxt/types'
import { FETCH_HEADER_PERSONALIZED_DATA } from '@/store/header/header.type'
import { User } from '@/services/user/user'
import { GoogleTrackingSetPayload } from '@/analytics/event-manager/event-payload-interface'
import {
  PAGE_VIEW,
  GOOGLE_TRACKING_SET,
} from '@/analytics/event-manager/event-key'
import { GlobalVuexState } from '@/store/global-state'

export default (({ app, store }) => {
  app.router!.afterEach(async () => {
    const user = User.getInstance()
    if (user.isLogin()) {
      await store.dispatch(`header/${FETCH_HEADER_PERSONALIZED_DATA}`)

      const userId = (store.state as GlobalVuexState).header.headerPersonalized!
        .personalize.id

      app.$analytics<GoogleTrackingSetPayload>(GOOGLE_TRACKING_SET, {
        key: 'userId',
        value: userId?.toString() || '',
      })
    }

    const { roleCode } = user.userState
    const role = roleCode === -1 ? '訪客' : roleCode // MY83-rt 舊有邏輯

    app.$analytics<GoogleTrackingSetPayload>(GOOGLE_TRACKING_SET, {
      key: 'dimension1',
      value: role.toString(),
    })

    app.$analytics(PAGE_VIEW)
  })
}) as NuxtPlugin
