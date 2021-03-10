import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Context } from '@nuxt/types'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/question/list'
import {
  FETCH_PAGE_DATA,
  FETCH_QUESTION_LIST,
  FETCH_SEARCH_QUESTION_LIST,
} from '@/store/question/list.type'
import { ErrorPageType } from '@/config/error-page.config'
import { isAxiosError } from '@/api/helper'
import { PageService, PageType } from '@/services/question/PageService'
import { Content } from '@/services/page/Content'
import { CanonicalService } from '@/seo/canonical-service'
const ListPage = () => import('../list/QuestionListPage.vue')

const fetchList = (
  pageType: PageType,
  { from, route, store }: Context,
  payload: FetchListPayload
) => {
  const currentParam = (store.state as QuestionListVuexState).questionList
    .currentParam
  const defaultPageParam = ['page', 'sort']
  const searchPageParam = ['page', 'sort', 'q']
  const currentPageParam =
    pageType === PageType.Search ? searchPageParam : defaultPageParam

  const isAllParamMatch = currentPageParam.every(
    (key) => currentParam[key] === payload[key]
  )

  // 與目前搜尋字串、頁數或是排序條件不同才打 API
  if (from?.path !== route.path || !isAllParamMatch) {
    return store.dispatch(
      `questionList/${
        pageType === PageType.Search
          ? FETCH_SEARCH_QUESTION_LIST
          : FETCH_QUESTION_LIST
      }`,
      payload
    )
  }
}

export default {
  watchQuery: ['page', 'sort', 'q'],
  async asyncData(ctx) {
    const { store, query, error, redirect, route } = ctx
    const pageType = route.meta[route.meta.length - 1].pageType
    const pageService = new PageService({ pageType, query })

    const sanitizedQuery = pageService.sanitizePageQuery
    const transformedQuery = pageService.transformedQuery

    if (pageType === PageType.Search && !sanitizedQuery.q) {
      redirect({ name: 'questionList' })
      return
    }

    const payload = {
      sort: transformedQuery.sort || 'latest',
      page: transformedQuery.page ? Number(query.page) : 1,
      q: pageType === PageType.Search ? transformedQuery.q : undefined,
    }

    const questionListStore = (store.state as QuestionListVuexState)
      .questionList

    const fetchPageData: Promise<any>[] = []

    const fetchListData = fetchList(pageType, ctx, payload)

    if (fetchListData) {
      fetchPageData.push(fetchListData)
    }

    // 熱門討論跟熱門文章有資料就不再重打 API
    if (
      !(questionListStore.popularQuestions || questionListStore.popularBlogs)
    ) {
      fetchPageData.push(store.dispatch(`questionList/${FETCH_PAGE_DATA}`))
    }

    try {
      await Promise.all([...Content.requests(ctx), ...fetchPageData])
    } catch (err) {
      if (!isAxiosError(err)) throw err

      const statusCode =
        err.response?.status === 404 ? err.response.status : 500
      const message = statusCode ? ErrorPageType.QUESTION : ErrorPageType.SERVER

      return error({
        statusCode,
        message,
      })
    }

    const shouldRedirect = pageService.shouldSimplifyQuery(sanitizedQuery)
    if (shouldRedirect) {
      redirect({ query: transformedQuery })
      return
    }

    // 如果頁面超過最大頁面，則導回討論區首頁
    if (
      questionListStore.meta!.pagination.currentPage >
      questionListStore.meta!.pagination.totalPage
    ) {
      redirect({ name: 'questionList' })
    }
  },
  head() {
    const canonical = CanonicalService.getCanonical({
      hostname: this.$env.HOST_URL,
      route: this.$route,
      acceptedQueryStringKeys: ['page', 'sort', 'q'],
    })

    return {
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: canonical,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: canonical,
        },
      ],
    }
  },
  methods: {
    toPage(index) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: String(index),
        },
      })
    },
  },
  render(h) {
    return h(ListPage, {
      on: {
        'to-page': this.toPage,
      },
    })
  },
} as ComponentOption

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance extends Vue {}

export interface Data {}

export type Methods = {
  toPage(index: number): void
}

export interface Computed {}

export interface Props {}

export interface QuestionListVuexState extends GlobalVuexState {
  questionList: State
}

interface FetchListPayload {
  page: number
  sort: string
  q: string | undefined
}
