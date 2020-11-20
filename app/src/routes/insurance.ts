import { CreateRouteFunction } from '@/nuxt-modules/flexible-routes/module'

export const createRoutes: CreateRouteFunction = (resolve) => {
  return [
    {
      name: 'insuranceProduct',
      path: '/product/:id(\\d+)',
      component: resolve('@/views/insurance/product/Index.vue'),
      meta: {
        // mobile 有自己獨立的 scroll to top 規則ˋ，故這邊只在 desktop 上開啟 global 的 scroll to top 功能
        showScrollToTop: {
          desktop: true,
        },
        requiredStoreModules: ['insuranceProduct'],
      },
    },
    {
      name: 'insuranceList',
      path: '/insurance/:insurance',
      component: resolve('@/views/insurance/page/Index.vue'),
      meta: {
        showScrollToTop: true,
        requiredStoreModules: ['insurance'],
      },
    },
  ]
}
