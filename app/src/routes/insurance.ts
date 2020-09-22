import { NuxtRouteConfig } from '@nuxt/types/config/router'
import {
  CreateRouteFunction,
  NuxtRouteResolve,
} from '@/nuxt-modules/flexible-routes/module'

const insurancePageList = [
  { name: 'medical', path: '/medical' },
  { name: 'casualty', path: '/casualty' },
  { name: 'criticalIllness', path: '/critical-illness' },
  { name: 'life', path: '/life' },
  { name: 'cancer', path: '/cancer' },
  { name: 'disability', path: '/disability' },
  { name: 'endowment', path: '/endowment' },
  { name: 'car', path: '/car' },
  { name: 'motor', path: '/motor' },
  { name: 'pet', path: '/pet' },
  { name: 'travel', path: '/travel' },
]

const generateInsurancePage = (
  resolve: NuxtRouteResolve
): NuxtRouteConfig[] => {
  return insurancePageList.map((insurance) => {
    return {
      name: insurance.name,
      path: insurance.path,
      component: resolve('@/views/insurance/page/Index.vue'),
      meta: {
        insurance: insurance.path.split('/')[1],
        requiredStoreModules: ['insurance'],
      },
    }
  })
}

export const createRoutes: CreateRouteFunction = (resolve) => {
  return [...generateInsurancePage(resolve)]
}
