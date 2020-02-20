import _ from 'lodash'
import { Module } from 'vuex'
import * as types from './question.type'
import * as api from '@/api/question/question'
import {
  QuestionData,
  AnswerData,
  QuestionPersonalize,
  AnswerPersonalize,
  FollowQuestionResponse,
  UnFollowQuestionResponse,
  SetBestAnswerResponse,
  UnsetBestAnswerResponse,
  AddAnswerPayload,
  AddAnswerResponse,
  AddResponsePayload,
  ResponseData,
  AddResponseResponse,
} from '@/api/question/question.type'

const DefaultQuestionPersonalize: QuestionPersonalize = {
  is_owner: false,
  is_reporter: false,
  is_follower: false,
}

const DefaultAnswerPersonalize: AnswerPersonalize = {
  is_owner: false,
  is_reporter: false,
  like_status: 0,
}

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
      [types.HIGHLIGHT_BEST_ANSWER]({ commit, state }, bestAnswerId: number) {
        const bestAnswerIndex = _.findIndex(
          state.answers,
          (answer) => answer.answer_id === bestAnswerId
        )

        if (bestAnswerIndex !== -1) {
          commit(types.UPDATE_TOP_ANSWER_ORDER, bestAnswerIndex)
        }
      },
      async [types.FETCH_QUESTION_PERSONALIZE_DATA]({ commit }, id: number) {
        try {
          const { personalize } = await api.fetchQuestionPersonalizeData(id)
          commit(types.UPDATE_QUESTION_PERSONALIZE_DATA, personalize)
        } catch (err) {
          // @todo: error handler
          console.log(err)
        }
      },
      async [types.FETCH_ANSWER_PERSONALIZE_DATA](
        { commit, state },
        id: number
      ) {
        try {
          const data = await api.fetchAnswerPersonalizeData(id)

          const answers = state.answers?.map((answer) => {
            const personalize = data.find((personalizeResponse) => {
              return personalizeResponse.answer_id === answer.answer_id
            })

            if (personalize) {
              return {
                ...answer,
                personalize: personalize.personalize,
              }
            }
            return answer
          })

          commit(types.UPDATE_ANSWER_PERSONALIZE_DATA, answers)
        } catch (err) {
          // @todo: error handler
          console.log(err)
        }
      },
      async [types.FOLLOW_QUESTION]({ commit }, id: number) {
        try {
          const { success } = await api.followQuestion(id)
          if (success) {
            commit(types.UPDATE_QUESTION_FOLLOW_STATE, true)
          }
          return success
        } catch (err) {
          const { success } = err.response.data as FollowQuestionResponse
          return success
        }
      },
      async [types.UNFOLLOW_QUESTION]({ commit }, id: number) {
        try {
          const { success } = await api.unFollowQuestion(id)
          if (success) {
            commit(types.UPDATE_QUESTION_FOLLOW_STATE, false)
          }
          return success
        } catch (err) {
          const { success } = err.response.data as UnFollowQuestionResponse
          return success
        }
      },
      async [types.SET_QUESTION_BEST_ANSWER](
        { commit },
        data: setQuestionBestAnswerPayload
      ) {
        const { questionId, answerId } = data
        try {
          const { success } = await api.setBestAnswer(questionId, answerId)
          if (success) {
            commit(types.UPDATE_QUESTION_BEST_ANSWER, answerId)
          }
          return success
        } catch (err) {
          const { success } = err.response.data as SetBestAnswerResponse
          return success
        }
      },
      async [types.UNSET_QUESTION_BEST_ANSWER]({ commit }, id: number) {
        try {
          const { success } = await api.unsetBestAnswer(id)
          if (success) {
            commit(types.UPDATE_QUESTION_BEST_ANSWER, null)
          }
          return success
        } catch (err) {
          const { success } = err.response.data as UnsetBestAnswerResponse
          return success
        }
      },
      async [types.ADD_ANSWER]({ commit }, payload: AddAnswerPayload) {
        try {
          const { success, data } = await api.addAnswer(payload)
          if (success) {
            commit(types.UPDATE_NEW_ANSWER, data)
            commit(types.UPDATE_ANSWER_COUNT)
          }
          return data!.answer_id
        } catch (err) {
          const res = err.response.data as AddAnswerResponse
          return res
        }
      },
      async [types.ADD_RESPONSE](
        { commit, state },
        payload: AddResponsePayload
      ) {
        try {
          const { success, data } = await api.addResponse(payload)
          if (success) {
            const answerIndex = _.findIndex(
              state.answers,
              (answer) => answer.answer_id === payload.answerId
            )

            commit(types.UPDATE_NEW_RESPONSE, {
              answerIndex,
              data,
            })
          }
          return data!.response_id
        } catch (err) {
          const res = err.response.data as AddResponseResponse
          return res
        }
      },
    },
    mutations: {
      [types.UPDATE_QUESTION_DATA](state, data: QuestionData) {
        state.question = {
          ...data,
          personalize: DefaultQuestionPersonalize,
        }
      },
      [types.UPDATE_ANSWER_DATA](state, data: AnswerData[]) {
        state.answers = data.map((answer) => {
          return {
            ...answer,
            personalize: DefaultAnswerPersonalize,
          }
        })
      },
      [types.UPDATE_TOP_ANSWER_ORDER](state, index: number) {
        const bestAnswer: AnswerData = state.answers!.splice(index, 1)[0]
        state.answers!.unshift(bestAnswer)
      },
      [types.UPDATE_QUESTION_PERSONALIZE_DATA](
        state,
        data: QuestionPersonalize
      ) {
        state.question!.personalize = data
      },
      [types.UPDATE_ANSWER_PERSONALIZE_DATA](state, data: AnswerData[]) {
        state.answers = data
      },
      [types.UPDATE_QUESTION_FOLLOW_STATE](state, status: boolean) {
        state.question!.personalize!.is_follower = status
      },
      [types.UPDATE_QUESTION_BEST_ANSWER](state, answerId: number | null) {
        state.question!.best_answer_id = answerId
      },
      [types.UPDATE_NEW_ANSWER](state, data: AnswerData) {
        state.answers!.push({
          ...data,
          personalize: DefaultAnswerPersonalize,
        })
      },
      [types.UPDATE_ANSWER_COUNT](state) {
        state.question!.question_meta.answer_count += 1
      },
      [types.UPDATE_NEW_RESPONSE](
        state,
        { answerIndex, data }: MutateResponsePayload
      ) {
        state.answers![answerIndex].responses.push(data)
      },
    },
  }
}

export interface State {
  question: QuestionData | null
  answers: AnswerData[] | null
}

interface setQuestionBestAnswerPayload {
  questionId: number
  answerId: number
}

interface MutateResponsePayload {
  answerIndex: number
  data: ResponseData
}
