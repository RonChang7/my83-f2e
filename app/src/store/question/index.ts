import { Module } from 'vuex'
import * as types from './question.type'
import * as api from '@/api/question/question'
import { QuestionData, AnswerData } from '@/api/question/question.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        question: null,
        answers: null,
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
      async [types.FETCH_ANSWER_DATA]({ commit }, id: number) {
        try {
          const { data } = await api.fetchAnswerData(id)
          commit(types.UPDATE_ANSWER_DATA, data)
        } catch (err) {
          // @todo: error handler
          console.log(err)
        }
      },
    },
    mutations: {
      [types.UPDATE_QUESTION_DATA](state, data) {
        state.question = data
      },
      [types.UPDATE_ANSWER_DATA](state, data) {
        state.answers = data
      },
    },
  }
}

export interface State {
  question: QuestionData | null
  answers: AnswerData[] | null
}
