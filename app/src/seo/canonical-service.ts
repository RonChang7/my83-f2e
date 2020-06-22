import { Route } from 'vue-router'
import { getFirstQuery } from '@/utils/query-string'

const rules: Rule[] = [
  {
    checkMatch: (route) => route.path === '/question/search',
    getCanonical: (route) => {
      const queryString: Record<string, string> = {}

      if (route.query.q) {
        queryString.q = getFirstQuery(route.query.q)
      }

      if (
        route.query.page &&
        /^\d+$/.test(getFirstQuery(route.query.page)) &&
        parseInt(getFirstQuery(route.query.page)) > 1
      ) {
        queryString.page = getFirstQuery(route.query.page)
      }

      if (queryString) {
        return `/question/search?${queryString}`
      }

      return '/question'
    },
  },
]

export default class CanonicalService {
  static getCanonical(hostname: string, route: Route) {
    const matchRule = rules.find((rule) => rule.checkMatch(route))

    if (matchRule) {
      return `${hostname}${matchRule.getCanonical(route)}`
    }

    return `${hostname}${route.path}`
  }
}

interface Rule {
  checkMatch(route: Route): boolean
  getCanonical(route: Route): string
}
