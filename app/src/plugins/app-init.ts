import _ from 'lodash'
import { Plugin as NuxtPlugin } from '@nuxt/types'
import { createStoreModule as createGlobalStoreModule } from '@/store/global/index'
import { createStoreModule as createHeaderStoreModule } from '@/store/header/index'
import { FETCH_HEADER_NAV_DATA } from '@/store/header/header.type'
import { UPDATE_USER_AGENT } from '@/store/global/global.type'
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
      `${storeModules.header.moduleName}/${FETCH_HEADER_NAV_DATA}`
    )
  }

  // Update user-agent
  store.commit(`${storeModules.global.moduleName}/${UPDATE_USER_AGENT}`, {
    isDesktop: app.$ua.isFromPc(),
    isMobile: app.$ua.isFromSmartphone(),
    isTablet: app.$ua.isFromTablet(),
  })

  if (process.client && !user.isLogin()) {
    user.updateLandingUrl()
  }
}) as NuxtPlugin
