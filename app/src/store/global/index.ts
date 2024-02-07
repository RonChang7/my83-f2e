import { Module } from 'vuex'
import * as types from './global.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        loginPanel: {
          display: false,
          targetPanel: 'login',
        },
        actionAfterLogin: null,
        actionAfterClosePanel: null,
        globalDialogVisible: false,
        globalDialogContent: null,
        userAgent: null,
      }
    },
    getters: {},
    actions: {
      [types.OPEN_LOGIN_PANEL]({ commit }, targetPanel: string) {
        commit(types.UPDATE_LOGIN_PANEL_STATUS, {
          status: true,
          targetPanel,
        })
      },
      [types.NAVIGATE_LOGIN_PANEL]({ commit }, targetPanel: string) {
        commit(types.UPDATE_LOGIN_PANEL_STATUS, {
          targetPanel,
        })
      },
      [types.CLOSE_LOGIN_PANEL]({ commit }) {
        commit(types.UPDATE_LOGIN_PANEL_STATUS, {
          status: false,
        })
      },
      [types.UPDATE_AFTER_LOGIN_EVENT]({ commit }, data: Function) {
        commit(types.UPDATE_AFTER_LOGIN_EVENT, data)
      },
      [types.UPDATE_AFTER_CLOSE_LOGIN_PANEL_EVENT](
        { commit },
        data: Function | null
      ) {
        commit(types.UPDATE_AFTER_CLOSE_LOGIN_PANEL_EVENT, data)
      },
      [types.OPEN_GLOBAL_DIALOG]({ commit }) {
        commit(types.UPDATE_GLOBAL_DIALOG_DISPLAY, true)
      },
      [types.CLOSE_GLOBAL_DIALOG]({ commit }) {
        commit(types.UPDATE_GLOBAL_DIALOG_DISPLAY, false)
      },
      [types.UPDATE_GLOBAL_DIALOG]({ commit }, data: GlobalDialogContent) {
        commit(types.UPDATE_GLOBAL_DIALOG_CONTENT, data)
      },
    },
    mutations: {
      [types.UPDATE_LOGIN_PANEL_STATUS](
        state,
        data: {
          status?: boolean
          targetPanel?: TargetPanel
        }
      ) {
        'status' in data && (state.loginPanel.display = data.status!)
        data.targetPanel && (state.loginPanel.targetPanel = data.targetPanel)
      },
      [types.UPDATE_AFTER_LOGIN_EVENT](state, data: Function) {
        state.actionAfterLogin = data
      },
      [types.UPDATE_AFTER_CLOSE_LOGIN_PANEL_EVENT](
        state,
        data: Function | null
      ) {
        state.actionAfterClosePanel = data
      },
      [types.UPDATE_GLOBAL_DIALOG_DISPLAY](state, visible: boolean) {
        state.globalDialogVisible = visible
      },
      [types.UPDATE_GLOBAL_DIALOG_CONTENT](state, data: GlobalDialogContent) {
        state.globalDialogContent = data
      },
      [types.UPDATE_USER_AGENT](state, data: UserAgent) {
        state.userAgent = data
      },
    },
  }
}

export interface State {
  loginPanel: LoginPanelState
  actionAfterLogin: Function | null
  actionAfterClosePanel: Function | null
  globalDialogVisible: boolean
  globalDialogContent: GlobalDialogContent | null
  userAgent: UserAgent | null
}

export interface LoginPanelState {
  display: boolean
  targetPanel: TargetPanel
}

export type TargetPanel = 'login' | 'sign-up' | 'forget-password'

export interface GlobalDialogContent {
  lockScroll?: boolean
  title?: string
  content?: string
  leftButtonText: string
  leftButtonType?: string
  leftButtonCloseDialogAfterClick?: boolean
  rightButtonText?: string
  rightButtonType?: string
  rightButtonCloseDialogAfterClick?: boolean
  defaultActionButton?: 'left' | 'right'
  checkBeforeAction?: boolean
  checkBeforeActionText?: string
  checkBeforeActionErrMsg?: string
  errMsg?: string
  leftConfirmFn?: Function
  rightConfirmFn?: Function
  closeFn?: Function
}

export interface UserAgent {
  isDesktop: boolean
  isMobile: boolean
  isTablet: boolean
}
