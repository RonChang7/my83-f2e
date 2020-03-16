import _ from 'lodash'
import { Plugin as NuxtPlugin } from '@nuxt/types'
import { createStoreModule as createGlobalStoreModule } from '@/store/global/index'
import { createStoreModule as createHeaderStoreModule } from '@/store/header/index'
import { UPDATE_USER_AGENT } from '@/store/global/global.type'
import { User } from '@/services/user/user'
import { Auth } from '@/services/auth/auth'

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

export default (({ app, store }) => {
  // 設定 my83 token name
  const auth = Auth.getInstance()
  auth.setTokenKey(app.$env.JWT_TOKEN_NAME)

  const user = User.getInstance()

  _.forEach(storeModules, ({ createModule, moduleName }) => {
    app.$registerStore({
      module: createModule(),
      moduleName,
      store: app.store,
    })
  })

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
