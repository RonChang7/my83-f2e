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
    {
      name: 'questionList',
      path: '/question',
      component: resolve('@/views/question/list/CreateQuestionListPage.ts'),
      meta: {
        pageType: 'list',
        requiredStoreModules: ['questionList'],
      },
    },
    {
      name: 'questionSearch',
      path: '/question/search',
      component: resolve('@/views/question/list/CreateQuestionListPage.ts'),
      meta: {
        pageType: 'search',
        requiredStoreModules: ['questionList'],
      },
    },
    {
      name: 'questionAsking',
      path: '/question/asking/:id(\\d+)?',
      component: resolve('@/views/question/asking/Index.vue'),
      meta: {
        requiredStoreModules: ['question'],
      },
    },
    {
      name: 'questionPage',
      path: '/question/:id(\\d+)',
      component: resolve('@/views/question/page/Index.vue'),
      meta: {
        requiredStoreModules: ['question'],
      },
    },
  ]
}
