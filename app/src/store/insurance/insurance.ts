import { Module } from 'vuex'
import * as types from './insurance.type'
import * as api from '@/api/insurance/insurance'
import {
  InsurancePageStaticData,
  Glossary,
  Principle,
  Faq,
} from '@/api/insurance/insurance.type'
import { RelatedBlog, RelatedQuestion } from '@/api/type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        id: '',
        name: '',
        queryForQuestion: '',
        image: '',
        description: '',
        glossary: null,
        principle: null,
        faq: null,
        relatedBlogs: null,
        relatedQuestions: null,
      }
    },
    getters: {},
    actions: {
      [types.FETCH_PAGE_DATA]({ dispatch, commit, state }, insurance: string) {
        if (insurance === state.id) {
          return Promise.resolve()
        }

        return new Promise((resolve) => {
          Promise.all([
            dispatch(types.FETCH_STATIC_DATA, insurance),
            dispatch(types.FETCH_RELATED_BLOGS, insurance),
            dispatch(types.FETCH_RELATED_QUESTIONS, insurance),
          ])
            .then(([insuranceStaticData]) => {
              commit(types.UPDATE_STATIC_DATA, insuranceStaticData)
              resolve()
            })
            .catch(() => resolve())
        })
      },
      [types.FETCH_STATIC_DATA]({ commit }, insurance: string) {
        return new Promise((resolve, reject) => {
          api
            .fetchInsurancePageStaticData({
              host: this.$env.HOST_URL as string,
              insurance,
            })
            .then((data) => {
              commit(types.UPDATE_STATIC_DATA, data)
              resolve()
            })
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_RELATED_BLOGS]({ commit }, insurance: string) {
        return new Promise((resolve) => {
          api
            .fetchRelatedBlogs(insurance)
            .then(({ data }) => {
              commit(types.UPDATE_RELATED_BLOGS, data)
              resolve()
            })
            .catch(() => resolve())
        })
      },
      [types.FETCH_RELATED_QUESTIONS]({ commit }, insurance: string) {
        return new Promise((resolve) => {
          api
            .fetchRelatedQuestions(insurance)
            .then(({ data }) => {
              commit(types.UPDATE_RELATED_QUESTIONS, data)
              resolve()
            })
            .catch(() => resolve())
        })
      },
    },
    mutations: {
      [types.UPDATE_STATIC_DATA](state, data: InsurancePageStaticData) {
        state.id = data.id
        state.name = data.name
        state.queryForQuestion = data.query_for_question
        state.image = data.image
        state.description = data.description
        state.glossary = data.glossary
        state.principle = data.principle
        state.faq = data.faq
      },
      [types.UPDATE_RELATED_BLOGS](state, data: RelatedBlog[]) {
        state.relatedBlogs = data
      },
      [types.UPDATE_RELATED_QUESTIONS](state, data: RelatedQuestion[]) {
        state.relatedQuestions = data
      },
    },
  }
}

export interface State {
  id: string
  name: string
  queryForQuestion: string
  image: string
  description: string
  glossary: Glossary | null
  principle: Principle | null
  faq: Faq[] | null
  relatedQuestions: RelatedQuestion[] | null
  relatedBlogs: RelatedBlog[] | null
}
