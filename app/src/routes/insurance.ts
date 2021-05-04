import { CreateRouteFunction } from '@/nuxt-modules/flexible-routes/module'
import { RouteConfig } from '@/types/router'
export enum InsuranceListType {
  FEATURE_TAG = 'insuranceFeatureTagList',
  EXTERNAL = 'insuranceExternalList',
  NORMAL = 'insuranceNormalList',
}
export const externalInsuranceRouteNames = ['car', 'motor']

export const createRoutes: CreateRouteFunction<RouteConfig> = (resolve) => {
  return [
    {
      name: 'insuranceLeaderBoard',
      path: '/product/leaderboard',
      component: resolve('@/views/insurance/leader-board/Index.vue'),
      meta: {
        requiredStoreModules: ['insuranceLeaderBoard'],
      },
    },
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
      name: InsuranceListType.EXTERNAL,
      path: `/insurance/:insurance(${externalInsuranceRouteNames.join('|')})`,
      component: resolve('@/views/insurance/page/Index.vue'),
      meta: {
        showScrollToTop: true,
        requiredStoreModules: ['insurance'],
      },
    },
    {
      name: InsuranceListType.NORMAL,
      path: '/insurance/:insurance',
      component: resolve('@/views/insurance/page/Index.vue'),
      meta: {
        showScrollToTop: true,
        requiredStoreModules: ['insurance'],
      },
    },
    {
      name: InsuranceListType.FEATURE_TAG,
      path: '/tags/:insurance',
      component: resolve('@/views/insurance/page/Index.vue'),
      meta: {
        showScrollToTop: true,
        requiredStoreModules: ['insurance'],
      },
    },
  ]
}
