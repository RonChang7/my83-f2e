import { Module } from 'vuex'
import * as types from './meta.type'
import * as api from '@/api/meta/meta'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        activeSalesCount: 0,
      }
    },
    getters: {},
    actions: {
      async [types.FETCH_ACTIVE_SALES_COUNT]({ commit }) {
        try {
          const { data } = await api.fetchActiveSalesCount()
          commit(types.UPDATE_ACTIVE_SALES_COUNT, data.actived_sales_count)
          this.$cookies.set(
            this.$cookiesKey.LAST_UPDATE_ACTIVE_SALES_COUNT,
            Date.now()
          )
        } catch (err) {}
      },
    },
    mutations: {
      [types.UPDATE_ACTIVE_SALES_COUNT](state, count: number) {
        state.activeSalesCount = count
      },
    },
  }
}

export interface State {
  activeSalesCount: number
}
