import { CreateRouteFunction } from '@/nuxt-modules/flexible-routes/module'
import { RouteConfig } from '@/types/router'

export const createRoutes: CreateRouteFunction<RouteConfig> = (resolve) => {
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
