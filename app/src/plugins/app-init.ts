import _ from 'lodash'
import { Plugin as NuxtPlugin } from '@nuxt/types'
import { createStoreModule as createGlobalStoreModule } from '@/store/global/index'
import { createStoreModule as createHeaderStoreModule } from '@/store/header/index'
import { createStoreModule as createPageMetaStoreModule } from '@/store/seo/page-meta'
import { createStoreModule as createJsonLdStoreModule } from '@/store/seo/json-ld'
import { createStoreModule as createMetaStoreModule } from '@/store/meta/index'
import { UPDATE_USER_AGENT } from '@/store/global/global.type'

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
  meta: {
    moduleName: 'meta',
    createModule: () => createMetaStoreModule(),
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

  if (process.client && !app.$auth.isLogin) {
    app.$auth.setLandingUrl()
  }
}) as NuxtPlugin

interface StoreModule {
  moduleName: string
  createModule: Function
}
