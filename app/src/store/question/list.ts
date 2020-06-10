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
} from '@/api/question/list.type'
import { Pagination } from '@/api/type'
import { paginationResponseDataTransform } from '@/utils/api-data-transform'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        currentPage: 0,
        currentSort: '',
        currentSearchQuery: '',
        list: null,
        meta: null,
        popularQuestions: null,
        popularBlogs: null,
      }
    },
    getters: {},
    actions: {
      [types.FETCH_PAGE_DATA]({ dispatch, commit }) {
        return new Promise((resolve) => {
          Promise.all([
            dispatch(types.FETCH_POPULAR_QUESTIONS),
            dispatch(types.FETCH_POPULAR_BLOGS),
          ])
            .then(([popularQuestions, popularBlogs]) => {
              commit(types.UPDATE_POPULAR_QUESTIONS, popularQuestions)
              commit(types.UPDATE_POPULAR_BLOGS, popularBlogs)
              resolve()
            })
            .catch(() => resolve())
        })
      },
      [types.FETCH_QUESTION_LIST](
        { commit },
        payload: FetchQuestionListPayload
      ) {
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve) => {
          api
            .fetchPopularQuestions()
            .then(({ data }) => resolve(data))
            .catch(() => resolve())
        })
      },
      [types.FETCH_POPULAR_BLOGS]() {
        return new Promise((resolve) => {
          api
            .fetchPopularBlogs()
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
        state.currentPage = page
      },
      [types.UPDATE_CURRENT_SORT](state, sort: string) {
        state.currentSort = sort
      },
      [types.UPDATE_CURRENT_SEARCH_QUERY](state, q: string) {
        state.currentSearchQuery = q
      },
    },
  }
}

export interface State {
  currentPage: number
  currentSort: string
  currentSearchQuery: string
  list: QuestionListData[] | null
  meta: {
    pagination: Pagination
    sort: QuestionListSortType
  } | null
  popularQuestions: PopularQuestion[] | null
  popularBlogs: PopularBlog[] | null
}
