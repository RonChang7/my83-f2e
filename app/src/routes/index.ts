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
      path: '/question',
      component: resolve('@/views/question/list/Index.vue'),
      meta: {
        requiredStoreModules: ['questionList'],
      },
    },
    {
      path: '/question/asking/:id(\\d+)?',
      component: resolve('@/views/question/asking/Index.vue'),
      meta: {
        requiredStoreModules: ['question'],
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
