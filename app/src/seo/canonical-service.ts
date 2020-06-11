import { Route } from 'vue-router'
import _ from 'lodash'
import qs from 'qs'

const rules: Rule[] = [
  {
    checkMatch: (route) => route.path === '/question/search',
    getCanonical: (route) => {
      const { page, q } = route.query
      const query: Record<string, string | undefined> = {}

      if (q) {
        query.q = _.isString(q)
          ? q
          : _.isArray(q)
          ? q[0] || undefined
          : undefined
      }

      if (page) {
        query.page =
          _.isString(page) && /^\d+$/.test(page) && page !== '1'
            ? page
            : undefined
      }

      const queryString = qs.stringify(_.pickBy(query, _.identity))

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
