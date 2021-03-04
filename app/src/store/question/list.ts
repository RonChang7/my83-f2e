import { Module } from 'vuex'
import * as types from './list.type'
import { UPDATE_PAGE_META } from '@/store/seo/seo.type'
import * as api from '@/api/question/list'
import {
  PopularBlog,
  PopularQuestion,
  QuestionListData,
  QuestionListMeta,
  QuestionListSortType,
  FetchQuestionListPayload,
  FetchSearchQuestionListPayload,
  PromotionsResponse,
} from '@/api/question/list.type'
import { Pagination } from '@/api/type'
import { paginationResponseDataTransform } from '@/utils/api-data-transform'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        currentParam: {
          page: 0,
          sort: '',
          q: '',
        },
        list: null,
        meta: null,
        popularQuestions: null,
        popularBlogs: null,
        promotions: null,
      }
    },
    getters: {},
    actions: {
      [types.FETCH_PAGE_DATA]({ dispatch, commit }) {
        return new Promise<void>((resolve) => {
          Promise.all([
            dispatch(types.FETCH_POPULAR_QUESTIONS),
            dispatch(types.FETCH_POPULAR_BLOGS),
            dispatch(types.FETCH_PROMOTIONS),
          ])
            .then(([popularQuestions, popularBlogs, promotions]) => {
              commit(types.UPDATE_POPULAR_QUESTIONS, popularQuestions)
              commit(types.UPDATE_POPULAR_BLOGS, popularBlogs)
              commit(types.UPDATE_PROMOTIONS, promotions)
              resolve()
            })
            .catch(() => resolve())
        })
      },
      [types.FETCH_QUESTION_LIST](
        { commit },
        payload: FetchQuestionListPayload
      ) {
        return new Promise<void>((resolve, reject) => {
          api
            .fetchQuestionList(payload)
            .then(({ data, meta, page_meta }) => {
              commit(types.UPDATE_QUESTION_LIST_DATA, data)
              commit(types.UPDATE_QUESTION_LIST_META, meta)
              commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                root: true,
              })
              commit(types.UPDATE_CURRENT_PAGE, payload.page)
              commit(types.UPDATE_CURRENT_SORT, payload.sort)
              commit(types.UPDATE_CURRENT_SEARCH_QUERY, '')
              resolve()
            })
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_SEARCH_QUESTION_LIST](
        { commit },
        payload: FetchSearchQuestionListPayload
      ) {
        return new Promise<void>((resolve, reject) => {
          api
            .fetchSearchQuestionList(payload)
            .then(({ data, meta, page_meta }) => {
              commit(types.UPDATE_QUESTION_LIST_DATA, data)
              commit(types.UPDATE_QUESTION_LIST_META, meta)
              commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                root: true,
              })
              commit(types.UPDATE_CURRENT_PAGE, payload.page)
              commit(types.UPDATE_CURRENT_SORT, payload.sort)
              commit(types.UPDATE_CURRENT_SEARCH_QUERY, payload.q)
              resolve()
            })
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_POPULAR_QUESTIONS]() {
        return new Promise<PopularQuestion[] | void>((resolve) => {
          api
            .fetchPopularQuestions()
            .then(({ data }) => resolve(data))
            .catch(() => resolve())
        })
      },
      [types.FETCH_POPULAR_BLOGS]() {
        return new Promise<PopularBlog[] | void>((resolve) => {
          api
            .fetchPopularBlogs()
            .then(({ data }) => resolve(data))
            .catch(() => resolve())
        })
      },
      [types.FETCH_PROMOTIONS]() {
        return new Promise<PromotionsResponse['data'] | void>((resolve) => {
          api
            .fetchPromotions()
            .then(({ data }) => resolve(data))
            .catch(() => resolve())
        })
      },
    },
    mutations: {
      [types.UPDATE_QUESTION_LIST_DATA](state, data: QuestionListData[]) {
        state.list = data
      },
      [types.UPDATE_QUESTION_LIST_META](state, meta: QuestionListMeta) {
        state.meta = {
          pagination: paginationResponseDataTransform(meta.pagination),
          sort: meta.sort,
        }
      },
      [types.UPDATE_POPULAR_QUESTIONS](state, data: PopularQuestion[]) {
        state.popularQuestions = data
      },
      [types.UPDATE_POPULAR_BLOGS](state, data: PopularBlog[]) {
        state.popularBlogs = data
      },
      [types.UPDATE_CURRENT_PAGE](state, page: number) {
        state.currentParam.page = page
      },
      [types.UPDATE_CURRENT_SORT](state, sort: string) {
        state.currentParam.sort = sort
      },
      [types.UPDATE_CURRENT_SEARCH_QUERY](state, q: string) {
        state.currentParam.q = q
      },
      [types.UPDATE_PROMOTIONS](state, data: PromotionsResponse['data']) {
        state.promotions = data
      },
    },
  }
}

export interface State {
  currentParam: {
    page: number
    sort: string
    q: string
  }
  list: QuestionListData[] | null
  meta: {
    pagination: Pagination
    sort: QuestionListSortType
  } | null
  popularQuestions: PopularQuestion[] | null
  popularBlogs: PopularBlog[] | null
  promotions: PromotionsResponse['data'] | null
}
