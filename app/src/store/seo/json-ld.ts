import { Module } from 'vuex'
import * as types from './seo.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        content: null,
      }
    },
    getters: {},
    actions: {
      [types.UPDATE_JSON_LD]({ commit }, data: []) {
        commit(types.UPDATE_JSON_LD, data)
      },
    },
    mutations: {
      [types.UPDATE_JSON_LD](state, data: []) {
        state.content = data
      },
    },
  }
}

export interface State {
  content: [] | null
}
