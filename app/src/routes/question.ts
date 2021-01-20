import { CreateRouteFunction } from '@/nuxt-modules/flexible-routes/module'
import { RouteConfig } from '@/types/router'

export const createRoutes: CreateRouteFunction<RouteConfig> = (resolve) => {
  return [
    // 討論區
    {
      name: 'questionList',
      path: '/question',
      component: resolve('@/views/question/list/CreateQuestionListPage.ts'),
      meta: {
        pageType: 'list',
        showScrollToTop: true,
        requiredStoreModules: ['questionList'],
      },
    },
    {
      name: 'questionSearch',
      path: '/question/search',
      component: resolve('@/views/question/list/CreateQuestionListPage.ts'),
      meta: {
        pageType: 'search',
        showScrollToTop: true,
        requiredStoreModules: ['questionList'],
      },
    },
    {
      name: 'questionAsking',
      path: '/question/asking/:id(\\d+)?',
      component: resolve('@/views/question/asking/Index.vue'),
      meta: {
        showScrollToTop: true,
        requiredStoreModules: ['question'],
      },
    },
    {
      name: 'questionPage',
      path: '/question/:id(\\d+)',
      component: resolve('@/views/question/page/Index.vue'),
      meta: {
        // mobile 有自己獨立的 scroll to top 規則ˋ，故這邊只在 desktop 上開啟 global 的 scroll to top 功能
        showScrollToTop: {
          desktop: true,
        },
        requiredStoreModules: ['question'],
      },
    },
  ]
}
