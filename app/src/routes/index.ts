import { CreateRouteFunction } from '@/nuxt-modules/flexible-routes/module'

export const createRoutes: CreateRouteFunction = (resolve) => {
  return [
    {
      name: 'health-check',
      path: '/ping',
      component: resolve('@/views/Ping.vue'),
    },
    {
      name: 'headerMenu',
      path: '/header-menu',
      component: resolve('@/views/header-menu/HeaderMenu.vue'),
      meta: {
        hideFooter: true,
      },
    },
  ]
}
