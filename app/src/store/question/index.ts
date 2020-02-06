import { Module } from 'vuex'
import * as types from './question.type'
import * as api from '@/api/question/question'
import { QuestionData } from '@/api/question/question.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        question: null,
      }
    },
    getters: {},
    actions: {
      async [types.FETCH_QUESTION_DATA]({ commit }, id: number) {
        try {
          const { data } = await api.fetchQuestionData(id)
          commit(types.UPDATE_QUESTION_DATA, data)
        } catch (err) {
          // @todo: error handler, e.g. question not exist.
          console.log(err)
        }
      },
    },
    mutations: {
      [types.UPDATE_QUESTION_DATA](state, data) {
        state.question = data
      },
    },
  }
}

export interface State {
  question: QuestionData | null
}
