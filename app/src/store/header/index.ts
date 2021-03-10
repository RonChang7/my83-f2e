import { Module } from 'vuex'
import {
  HeaderNavItem,
  HeaderPersonalized,
  Announcement,
} from '@/api/header/header.type'
import * as api from '@/api/header/header'
import * as types from './header.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        headerNavItems: [],
        headerPersonalized: null,
        announcement: null,
      }
    },
    getters: {},
    actions: {
      async [types.FETCH_HEADER_NAV_DATA]({ commit }) {
        try {
          const { header, announcement } = await api.fetchHeaderData()
          commit(types.UPDATE_HEADER_NAV_DATA, header)
          commit(types.UPDATE_HEADER_ANNOUNCEMENT, announcement)
        } catch (err) {}
      },
      async [types.FETCH_HEADER_PERSONALIZED_DATA]({ commit }) {
        try {
          const data = await api.fetchPersonalizedHeaderData()
          commit(types.UPDATE_HEADER_PERSONALIZED_DATA, data)
          this.$auth.setUserState({
            id: data.personalize.id,
            role: data.personalize.role,
            roleCode: data.personalize.role_code,
            nickname: data.personalize.nickname,
          })
        } catch (err) {
          commit(types.UPDATE_HEADER_PERSONALIZED_DATA, null)
        }
      },
    },
    mutations: {
      [types.UPDATE_HEADER_NAV_DATA](state, data: HeaderNavItem[]) {
        state.headerNavItems = data
      },
      [types.UPDATE_HEADER_PERSONALIZED_DATA](state, data: HeaderPersonalized) {
        state.headerPersonalized = data
      },
      [types.UPDATE_HEADER_ANNOUNCEMENT](state, data: Announcement) {
        state.announcement = data
      },
    },
  }
}

export interface State {
  headerNavItems: HeaderNavItem[]
  headerPersonalized: HeaderPersonalized | null
  announcement: Announcement | null
}
