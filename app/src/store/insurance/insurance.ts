import { Module } from 'vuex'
import * as types from './insurance.type'
import * as api from '@/api/insurance/insurance'
import {
  InsurancePageStaticData,
  Glossary,
  Principle,
  Faq,
} from '@/api/insurance/insurance.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        id: '',
        name: '',
        image: '',
        description: '',
        glossary: null,
        principle: null,
        faq: null,
      }
    },
    getters: {},
    actions: {
      [types.FETCH_PAGE_DATA]({ dispatch, commit }, insurance: string) {
        return new Promise((resolve) => {
          Promise.all([dispatch(types.FETCH_STATIC_DATA, insurance)])
            .then(([insuranceStaticData]) => {
              commit(types.UPDATE_STATIC_DATA, insuranceStaticData)
              resolve()
            })
            .catch(() => resolve())
        })
      },
      [types.FETCH_STATIC_DATA]({ commit, state }, insurance: string) {
        if (insurance === state.id) {
          return Promise.resolve()
        }

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
    },
    mutations: {
      [types.UPDATE_STATIC_DATA](state, data: InsurancePageStaticData) {
        state.id = data.id
        state.name = data.name
        state.image = data.image
        state.description = data.description
        state.glossary = data.glossary
        state.principle = data.principle
        state.faq = data.faq
      },
    },
  }
}

export interface State {
  id: string
  name: string
  image: string
  description: string
  glossary: Glossary | null
  principle: Principle | null
  faq: Faq[] | null
}
