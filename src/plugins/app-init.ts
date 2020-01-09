import { Plugin as NuxtPlugin } from '@nuxt/types'
import { createStoreModule as createHeaderStoreModule } from '@/store/header/index'
import * as types from '@/store/header/header.type'
import { User } from '@/modules/user/user'

// import global types
import '@/types/ua.type'

export default (({ app, store }) => {
  const moduleName = 'header'
  User.getInstance().UpdateUser()

  app.$registerStore({
    module: createHeaderStoreModule(),
    moduleName,
    store: app.store,
  })

  // Server 預先打一次 header，到 client 端後，如果身份是 sales ，另外在打一次 API
  if (process.server || User.role === 'sales') {
    store.dispatch(`${moduleName}/${types.FETCH_HEADER_NAV_DATA}`)
  }
}) as NuxtPlugin
