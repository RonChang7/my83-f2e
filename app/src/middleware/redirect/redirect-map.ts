import { Route } from 'vue-router'

export const rules: Rule[] = [
  /**
   * 討論區 redirect rule
   *
   * 舊有路由有以下可能的 URL
   * 列表：/question, /question/index, /question/index?page=
   * 搜尋：/question?search=, /question/index?search=, /question/index?search=&page=
   */
  {
    from: (route) => {
      const { search } = route.query
      return !!(
        (route.path === '/question' && search) ||
        route.path === '/question/index'
      )
    },
    to: (route) => {
      if (route.query.search) {
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
      }

      return {
        status: 301,
        path: '/question',
        query: route.query,
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
