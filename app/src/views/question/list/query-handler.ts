import { Route } from 'vue-router'

export const searchQueryValidate = (query: Route['query']) => {
  return {
    ...query,
    q: typeof query.q === 'string' && query.q.trim() ? query.q : undefined,
  }
}

export const pageQueryValidate = (query: Route['query']) => {
  return {
    ...query,
    page:
      typeof query.page === 'string' && /^\d+$/.test(query.page)
        ? query.page
        : undefined,
  }
}

export const sortQueryValidate = (
  query: Route['query'],
  sortType: string[]
) => {
  return {
    ...query,
    sort:
      typeof query.sort === 'string' && sortType.includes(query.sort)
        ? query.sort
        : undefined,
  }
}

export const pageQueryTransform = (query: Record<string, any>) => {
  return {
    ...query,
    page: query.page === '1' ? undefined : query.page,
  }
}

export const sortQueryTransform = (query: Record<string, any>) => {
  return {
    ...query,
    sort: query.sort === 'latest' ? undefined : query.sort,
  }
}
