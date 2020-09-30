import { CreateRouteFunction } from '@/nuxt-modules/flexible-routes/module'

export const createRoutes: CreateRouteFunction = (resolve) => {
  return [
    {
      name: 'insuranceList',
      path: '/insurance/:insurance',
      component: resolve('@/views/insurance/page/Index.vue'),
      meta: {
        requiredStoreModules: ['insurance'],
      },
    },
  ]
}
