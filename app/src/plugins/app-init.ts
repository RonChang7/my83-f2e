import _ from 'lodash'
import { Plugin as NuxtPlugin } from '@nuxt/types'
import { createStoreModule as createGlobalStoreModule } from '@/store/global/index'
import { createStoreModule as createHeaderStoreModule } from '@/store/header/index'
import * as types from '@/store/header/header.type'
import { User } from '@/services/user/user'

const storeModules = {
  global: {
    moduleName: 'global',
    createModule: () => createGlobalStoreModule(),
  },
  header: {
    moduleName: 'header',
    createModule: () => createHeaderStoreModule(),
  },
}

export default (async ({ app, store }) => {
  const user = User.getInstance()
  user.updateUser()

  _.forEach(storeModules, ({ createModule, moduleName }) => {
    app.$registerStore({
      module: createModule(),
      moduleName,
      store: app.store,
    })
  })

  // Server pre-fetch Header data for SEO performance
  if (process.server) {
    await store.dispatch(
      `${storeModules.header.moduleName}/${types.FETCH_HEADER_NAV_DATA}`
    )
  }

  if (process.client && User.role === 'guest') {
    user.updateLandingUrl()
  }
}) as NuxtPlugin
