import { Module } from 'vuex'
import * as types from './user.type'
import { Role, RoleCode } from '@/api/type'
import { Auth } from '@/services/auth/auth'
import { Suspect } from '@/services/auth/suspect'

const auth = Auth.getInstance()
const suspect = Suspect.getInstance()

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        id: 0,
        role: 'guest',
        roleCode: -1,
        nickname: '',
        firstHttpReferrer: '',
        firstUrl: '',
      }
    },
    getters: {
      [types.GET_USER_STATE]: (state) => {
        const { id, role, roleCode } = state
        return {
          id,
          role,
          roleCode,
        }
      },
      [types.GET_LANDING_URL]: (state) => {
        const { firstHttpReferrer, firstUrl } = state
        return {
          firstHttpReferrer,
          firstUrl,
        }
      },
    },
    actions: {
      [types.UPDATE_USER_STATE]({ commit }, userState: UserState) {
        if (auth.isLogin) {
          commit(types.SET_USER, userState)
          suspect.set(this.$cookiesKey.ROLE, userState.roleCode.toString())
          suspect.set(this.$cookiesKey.MEMBER, userState.id.toString())
        } else {
          commit(types.RESET_USER)
        }
      },
      [types.UPDATE_LANDING_URL]({ commit }) {
        commit(types.UPDATE_LANDING_URL, {
          firstHttpReferrer: document.referrer,
          firstUrl: window.location.href,
        } as LandingUrlInfo)
      },
    },
    mutations: {
      [types.SET_USER](state, userState: UserState) {
        state.id = userState.id
        state.role = userState.role
        state.roleCode = userState.roleCode
        state.nickname = userState.nickname
      },
      [types.RESET_USER](state) {
        state.id = 0
        state.role = 'guest'
        state.roleCode = -1
        state.nickname = ''
      },
      [types.UPDATE_LANDING_URL](state, landingUrlInfo: LandingUrlInfo) {
        state.firstHttpReferrer = landingUrlInfo.firstHttpReferrer
        state.firstUrl = landingUrlInfo.firstUrl
      },
    },
  }
}

export interface State {
  id: number
  role: UserRole
  roleCode: UserRoleCode
  nickname: string
  firstHttpReferrer: string
  firstUrl: string
}

export type UserRole = Role | 'guest'

export type UserRoleCode = RoleCode | -1

export const UserRoleMap: Record<UserRole, string> = {
  client: '保戶',
  sales: '業務員',
  guest: '訪客',
}

export interface LandingUrlInfo {
  firstHttpReferrer: string
  firstUrl: string
}
export interface UserState {
  id: number
  role: UserRole
  roleCode: UserRoleCode
  nickname: string
}
