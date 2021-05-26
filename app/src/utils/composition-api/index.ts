import _ from 'lodash'
import { useRouter, wrapProperty } from '@nuxtjs/composition-api'

export const useAnalytics = wrapProperty('$analytics', false)

export const useNuxtLinkChecker = () => {
  const router = useRouter()
  const isNuxtLink = (path: string) => {
    const matches = router.getMatchedComponents(path)
    return !_.isEmpty(matches)
  }

  return {
    isNuxtLink,
  }
}
