import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Context } from '@nuxt/types'
import {
  searchQueryValidate,
  pageQueryValidate,
  sortQueryValidate,
  pageQueryTransform,
  sortQueryTransform,
} from './query-handler'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/question/list'
import {
  FETCH_PAGE_DATA,
  FETCH_QUESTION_LIST,
  FETCH_SEARCH_QUESTION_LIST,
} from '@/store/question/list.type'
import { ErrorPageType } from '@/config/error-page.config'
import { QuestionListSortType } from '@/api/question/list.type'
const ListPage = () => import('../list/QuestionListPage.vue')

export default {
  watchQuery: ['page', 'sort', 'q'],
  async middleware(ctx) {
    const { store, query, error, redirect, route } = ctx
    const pageType = route.meta[route.meta.length - 1].pageType
    const sortType: QuestionListSortType[] = ['latest']
    const queryValidator = _.flow([
      pageType === 'search' ? searchQueryValidate : (q) => q,
      pageQueryValidate,
      _.curry(sortQueryValidate)(_, sortType),
    ])
    const queryTransformer = _.flow([pageQueryTransform, sortQueryTransform])

    const validatedQuery = queryValidator(query) as Record<string, any>

    if (pageType === 'search' && !validatedQuery.q) {
      redirect({ name: 'questionList' })
      return
    }

    if (validatedQuery.page === '1' || validatedQuery.sort === 'latest') {
      redirect({
        query: {
          ...queryTransformer(validatedQuery),
        },
      })
      return
    }

    const transformedQuery = queryTransformer(validatedQuery) as Record<
      string,
      string | undefined
    >

    const payload = {
      sort: transformedQuery.sort || 'latest',
      page: transformedQuery.page ? Number(query.page) : 1,
      q: pageType === 'search' ? transformedQuery.q : undefined,
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
      await Promise.all(fetchPageData)
    } catch (err) {
      const statusCode = err.response.status === 404 ? err.response.status : 500
      const message =
        err.response.status === 404
          ? ErrorPageType.QUESTION
          : ErrorPageType.SERVER

      return error({
        statusCode,
        message,
      })
    }

    // 如果頁面超過最大頁面，則導回討論區首頁
    if (
      questionListStore.meta!.pagination.currentPage >
      questionListStore.meta!.pagination.totalPage
    ) {
      redirect({ name: 'questionList' })
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

const fetchList = (
  pageType: string,
  { from, route, store }: Context,
  payload
) => {
  const questionListStore = (store.state as QuestionListVuexState).questionList
  const rules = [
    questionListStore.currentPage === payload.page,
    questionListStore.currentSort === payload.sort,
  ]

  if (pageType === 'search') {
    rules.push(questionListStore.currentSearchQuery === payload.q)
  }

  // 與目前搜尋字串、頁數或是排序條件不同才打 API
  if (from?.path !== route.path || !rules.every((rule) => rule)) {
    return store.dispatch(
      `questionList/${
        pageType === 'search' ? FETCH_SEARCH_QUESTION_LIST : FETCH_QUESTION_LIST
      }`,
      payload
    )
  }
}

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

export interface Methods {
  toPage(index: number): void
}

export interface Computed {}

export interface Props {}

export interface QuestionListVuexState extends GlobalVuexState {
  questionList: State
}
