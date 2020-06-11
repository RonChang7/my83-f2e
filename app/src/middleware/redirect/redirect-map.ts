import { Route } from 'vue-router'

export const rules: Rule[] = [
  {
    from: (route) => {
      const { search } = route.query
      return !!(route.path === '/question' && search)
    },
    to: (route) => {
      const queryMap = route.query
      const q = queryMap.search
      delete queryMap.search

      return {
        status: 301,
        path: '/question/search',
        query: {
          ...queryMap,
          q,
        },
      }
    },
  },
]

interface Rule {
  from(route: Route): boolean
  to(route: Route): redirectConfig
}

interface redirectConfig {
  status: number
  path: string
  query?: Route['query']
}
