<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/question/list'
import {
  FETCH_PAGE_DATA,
  FETCH_QUESTION_LIST,
} from '@/store/question/list.type'
import { ErrorPageType } from '@/config/error-page.config'
import {
  FetchQuestionListPayload,
  QuestionListSortType,
} from '@/api/question/list.type'
const ListPage = () => import('./QuestionListPage.vue')

export default {
  watchQuery: ['page', 'sort'],
  async middleware({ store, query, error, redirect }) {
    if (query?.page === '1' || query?.sort === 'latest') {
      const page = query?.page === '1' ? undefined : query?.page
      const sort = query?.sort === 'latest' ? undefined : query?.sort
      redirect({
        query: {
          ...query,
          page,
          sort,
        },
      })
      return
    }

    const sortType: QuestionListSortType[] = ['latest']
    const sort =
      typeof query?.sort === 'string'
        ? sortType.includes(query.sort as QuestionListSortType)
          ? query.sort
          : 'latest'
        : 'latest'

    const page =
      typeof query?.page === 'string'
        ? /^\d+$/.test(query.page)
          ? Number(query.page)
          : 1
        : 1

    const questionListStore = (store.state as QuestionListVuexState)
      .questionList

    const fetchPageData: Promise<any>[] = []

    // 與目前頁數或是排序條件不同才打 API
    if (
      !(
        questionListStore.currentPage === page &&
        questionListStore.currentSort === sort
      )
    ) {
      fetchPageData.push(
        store.dispatch(`questionList/${FETCH_QUESTION_LIST}`, {
          page,
          sort,
        } as FetchQuestionListPayload)
      )
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
      redirect('/question')
    }
  },
  methods: {
    toPage(index) {
      this.$router.push({
        query: {
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

export interface Methods {
  toPage(index: number): void
}

export interface Computed {}

export interface Props {}

export interface QuestionListVuexState extends GlobalVuexState {
  questionList: State
}
</script>
