import { CreateRouteFunction } from '@/nuxt-modules/flexible-routes/module'

export const createRoutes: CreateRouteFunction = (resolve) => {
  return [
    {
      name: 'insuranceProduct',
      path: '/insurance/:id(\\d+)',
      component: resolve('@/views/insurance/product/Index.vue'),
      meta: {
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
