import _ from 'lodash'
import { Plugin as NuxtPlugin } from '@nuxt/types'
import { createStoreModule as createGlobalStoreModule } from '@/store/global/index'
import { createStoreModule as createHeaderStoreModule } from '@/store/header/index'
import { createStoreModule as createPageMetaStoreModule } from '@/store/seo/page-meta'
import { createStoreModule as createJsonLdStoreModule } from '@/store/seo/json-ld'
import { createStoreModule as createUserStoreModule } from '@/store/user/index'
import { UPDATE_USER_AGENT } from '@/store/global/global.type'
import { Auth } from '@/services/auth/auth'
import { UPDATE_LANDING_URL } from '@/store/user/user.type'

const storeModules: Record<string, StoreModule> = {
  global: {
    moduleName: 'global',
    createModule: () => createGlobalStoreModule(),
  },
  header: {
    moduleName: 'header',
    createModule: () => createHeaderStoreModule(),
  },
  pageMeta: {
    moduleName: 'pageMeta',
    createModule: () => createPageMetaStoreModule(),
  },
  jsonLd: {
    moduleName: 'jsonLd',
    createModule: () => createJsonLdStoreModule(),
  },
  user: {
    moduleName: 'user',
    createModule: () => createUserStoreModule(),
  },
}

export default (({ app, store }, inject) => {
  // Set image bucket url
  inject('imageBucketUrl', app.$env.IMAGE_BUCKET_URL)

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

  const auth = Auth.getInstance()
  if (process.client && !auth.isLogin) {
    store.dispatch(`user/${UPDATE_LANDING_URL}`)
  }
}) as NuxtPlugin

interface StoreModule {
  moduleName: string
  createModule: Function
}
