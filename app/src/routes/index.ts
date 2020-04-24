import { CreateRouteFunction } from '@/nuxt-modules/flexible-routes/module'

export const createRoutes: CreateRouteFunction = (resolve) => {
  return [
    {
      name: 'health-check',
      path: '/ping',
      component: resolve('@/views/Ping.vue'),
    },
    {
      path: '/header-menu',
      component: resolve('@/views/header-menu/HeaderMenu.vue'),
      meta: {
        hideFooter: true,
      },
    },
    {
      path: '/question/:id(\\d+)',
      component: resolve('@/views/question/page/Index.vue'),
      meta: {
        requiredStoreModules: ['question'],
      },
    },
  ]
}
