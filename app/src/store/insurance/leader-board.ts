import { Module } from 'vuex'
import * as types from './leader-board.type'
import { UPDATE_PAGE_META, UPDATE_JSON_LD } from '@/store/seo/seo.type'
import * as api from '@/api/insurance/leader-board'
import { SortType, LeaderBoard } from '@/api/insurance/leader-board.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        title: '',
        description: '',
        sections: [],
        isFetching: false,
      }
    },
    getters: {},
    actions: {
      [types.FETCH_LEADER_BOARD]({ commit, state }, sort?: SortType) {
        if (state.isFetching) return

        return new Promise<void>((resolve, reject) => {
          commit(types.UPDATE_FETCHING_STATUS, true)

          api
            .fetchLeaderBoard(sort)
            .then(({ data, page_meta, json_ld }) => {
              commit(types.UPDATE_LEADER_BOARD, data)
              commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                root: true,
              })
              commit(`jsonLd/${UPDATE_JSON_LD}`, json_ld, { root: true })

              commit(types.UPDATE_FETCHING_STATUS, false)
              resolve()
            })
            .catch((error) => {
              commit(types.UPDATE_FETCHING_STATUS, false)
              return reject(error)
            })
        })
      },
    },
    mutations: {
      [types.UPDATE_LEADER_BOARD](state, data: LeaderBoard) {
        state.title = data.title
        state.description = data.description
        state.sections = data.sections
      },
      [types.UPDATE_FETCHING_STATUS](state, status: boolean) {
        state.isFetching = status
      },
    },
  }
}

export interface State {
  title: LeaderBoard['title']
  description: LeaderBoard['description']
  sections: LeaderBoard['sections']
  isFetching: boolean
}
