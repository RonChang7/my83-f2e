import { Module } from 'vuex'
import * as types from './header.type'
import { HeaderNavItem, HeaderPersonalizedData } from '@/api/header/header.type'
import * as api from '@/api/header/header'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        headerNavItems: [],
        headerPersonalizedData: {},
      }
    },
    getters: {},
    actions: {
      async [types.FETCH_HEADER_NAV_DATA]({ commit }) {
        const data = await api.fetchHeaderData()
        commit(types.UPDATE_HEADER_NAV_DATA, data)
      },
      async [types.FETCH_HEADER_PERSONALIZED_DATA]({ commit }) {
        const data = await api.fetchPersonalizedHeaderData()
        commit(types.UPDATE_HEADER_PERSONALIZED_DATA, data)
      },
    },
    mutations: {
      [types.UPDATE_HEADER_NAV_DATA](state, data) {
        state.headerNavItems = data
      },
      [types.UPDATE_HEADER_PERSONALIZED_DATA](state, data) {
        state.headerPersonalizedData = data
      },
    },
  }
}

export interface State {
  headerNavItems: HeaderNavItem[]
  headerPersonalizedData: HeaderPersonalizedData | {}
}
