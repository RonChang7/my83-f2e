import { Module } from 'vuex'
import * as types from './list.type'
import * as api from '@/api/question/list'
import { PopularBlog, PopularQuestion } from '@/api/question/list.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        popularQuestions: null,
        popularBlogs: null,
      }
    },
    getters: {},
    actions: {
      [types.FETCH_PAGE_DATA]({ dispatch }) {
        return new Promise((resolve, reject) => {
          Promise.all([
            dispatch(types.FETCH_POPULAR_QUESTIONS),
            dispatch(types.FETCH_POPULAR_BLOGS),
          ])
            .then(() => resolve())
            .catch((err) => reject(err))
        })
      },
      [types.FETCH_POPULAR_QUESTIONS]({ commit }) {
        return new Promise((resolve) => {
          api
            .fetchPopularQuestions()
            .then(({ data: popularQuestions }) => {
              commit(types.UPDATE_POPULAR_QUESTIONS, popularQuestions)
              resolve()
            })
            .catch(() => resolve())
        })
      },
      [types.FETCH_POPULAR_BLOGS]({ commit }) {
        return new Promise((resolve) => {
          api
            .fetchPopularBlogs()
            .then(({ data: popularBlogs }) => {
              commit(types.UPDATE_POPULAR_BLOGS, popularBlogs)
              resolve()
            })
            .catch(() => resolve())
        })
      },
    },
    mutations: {
      [types.UPDATE_POPULAR_QUESTIONS](state, data: PopularQuestion[]) {
        state.popularQuestions = data
      },
      [types.UPDATE_POPULAR_BLOGS](state, data: PopularBlog[]) {
        state.popularBlogs = data
      },
    },
  }
}

export interface State {
  popularQuestions: PopularQuestion[] | null
  popularBlogs: PopularBlog[] | null
}
