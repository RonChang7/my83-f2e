import _ from 'lodash'
import { Route } from 'vue-router'
import { QuestionListSortType } from '@/api/question/list.type'
import { getFirstQuery } from '@/utils/query-string'

export const enum PageType {
  List = 'list',
  Search = 'search',
}

export class PageService {
  private _pageType: PageType

  private _query: Route['query']

  constructor({ pageType, query }: PageServiceInitPayload) {
    this._pageType = pageType
    this._query = query
  }

  public shouldSimplifyQuery(query: Record<string, any>): boolean {
    if (_.isEmpty(query)) return false

    return !_.some(query) || query.page === '1' || query.sort === 'latest'
  }

  public get sanitizePageQuery(): Record<string, any> {
    const sortType: QuestionListSortType[] = ['latest']
    const _validateSearchQuery =
      this._pageType === PageType.Search ? this._validateSearchQuery : (q) => q
    const _validateSortQuery = _.partialRight(this._validateSortQuery, sortType)

    const queryValidator = _.flow([
      _validateSearchQuery,
      this._validatePageQuery,
      _validateSortQuery,
    ])

    return queryValidator(this._query)
  }

  public get transformedQuery(): Record<string, string | undefined> {
    const queryTransformer = _.flow([
      this._transformPageQuery,
      this._transformSortQuery,
    ])

    return queryTransformer(this.sanitizePageQuery)
  }

  private _validateSearchQuery(query: Route['query']) {
    if (query.q === undefined) return query

    const q = getFirstQuery(query.q)
    return {
      ...query,
      q: q.trim() ? q : undefined,
    }
  }

  private _validatePageQuery(query: Route['query']) {
    if (query.page === undefined) return query

    const page = getFirstQuery(query.page)
    return {
      ...query,
      page: /^\d+$/.test(page) ? page : undefined,
    }
  }

  private _validateSortQuery(query: Route['query'], sortType: string[]) {
    if (query.sort === undefined) return query

    const sort = getFirstQuery(query.sort)
    return {
      ...query,
      sort: sortType.includes(sort) ? sort : undefined,
    }
  }

  private _transformPageQuery(query: Record<string, any>) {
    return {
      ...query,
      page: query.page === '1' ? undefined : query.page,
    }
  }

  private _transformSortQuery(query: Record<string, any>) {
    return {
      ...query,
      sort: query.sort === 'latest' ? undefined : query.sort,
    }
  }
}

interface PageServiceInitPayload {
  pageType: PageType
  query: Route['query']
}
