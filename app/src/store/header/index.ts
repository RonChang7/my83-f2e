import { Module } from 'vuex'
import * as types from './header.type'
import { HeaderNavItem, HeaderPersonalized } from '@/api/header/header.type'
import * as api from '@/api/header/header'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        headerNavItems: [],
        headerPersonalized: null,
      }
    },
    getters: {},
    actions: {
      async [types.FETCH_HEADER_NAV_DATA]({ commit }) {
        try {
          const data = await api.fetchHeaderData()
          commit(types.UPDATE_HEADER_NAV_DATA, data)
        } catch (err) {
          // @todo: error handler
          // eslint-disable-next-line no-console
          console.log(err)
        }
      },
      async [types.FETCH_HEADER_PERSONALIZED_DATA]({ commit }) {
        try {
          const data = await api.fetchPersonalizedHeaderData()
          commit(types.UPDATE_HEADER_PERSONALIZED_DATA, data)
        } catch (err) {
          // @todo: error handler
          // eslint-disable-next-line no-console
          console.log(err)
        }
      },
    },
    mutations: {
      [types.UPDATE_HEADER_NAV_DATA](state, data) {
        state.headerNavItems = data
      },
      [types.UPDATE_HEADER_PERSONALIZED_DATA](state, data) {
        state.headerPersonalized = data
      },
    },
  }
}

export interface State {
  headerNavItems: HeaderNavItem[]
  headerPersonalized: HeaderPersonalized | null
}
