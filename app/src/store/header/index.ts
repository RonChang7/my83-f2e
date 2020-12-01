import { Module } from 'vuex'
import * as types from './header.type'
import { HeaderNavItem, HeaderPersonalized } from '@/api/header/header.type'
import * as api from '@/api/header/header'
import { UPDATE_USER_STATE } from '@/store/user/user.type'
import { UserState } from '@/store/user/index'

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
        } catch (err) {}
      },
      async [types.FETCH_HEADER_PERSONALIZED_DATA]({ commit, dispatch }) {
        try {
          const data = await api.fetchPersonalizedHeaderData()
          commit(types.UPDATE_HEADER_PERSONALIZED_DATA, data)

          const userState: UserState = {
            id: data.personalize.id,
            role: data.personalize.role,
            roleCode: data.personalize.role_code,
            nickname: data.personalize.nickname,
          }
          dispatch(`user/${UPDATE_USER_STATE}`, userState, { root: true })
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
    },
  }
}

export interface State {
  headerNavItems: HeaderNavItem[]
  headerPersonalized: HeaderPersonalized | null
}
