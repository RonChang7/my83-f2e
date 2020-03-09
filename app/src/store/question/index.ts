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
  UpdateLikeStatuePayload,
  AnswerMeta,
  LikeStatus,
  RelatedQuestion,
  RelatedBlog,
  RecommendProduct,
} from '@/api/question/question.type'
import { SimpleResponse } from '@/api/type'

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
        relatedQuestions: null,
        relatedBlogs: null,
        recommendProduct: null,
        dropdownMenu: {
          visible: false,
          top: null,
          left: null,
          disableBlur: false,
          options: null,
        },
        report: {
          visible: false,
          questionId: null,
          answerId: null,
        },
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
      async [types.SET_LIKE_STATUS](
        { commit, state },
        payload: UpdateLikeStatuePayload
      ) {
        try {
          const {
            success,
            answer_meta: data,
            like_status: likeStatus,
          } = await api.likeAnswer(payload)
          if (success) {
            const answerIndex = _.findIndex(
              state.answers,
              (answer) => answer.answer_id === payload.answerId
            )

            commit(types.UPDATE_LIKE_STATUS, {
              answerIndex,
              data,
              likeStatus,
            })
          }
        } catch (err) {
          // @todo: error handler
          console.log(err)
        }
      },
      async [types.FETCH_RELATED_QUESTIONS]({ commit }, id: number) {
        try {
          const { data } = await api.fetchRelatedQuestions(id)
          commit(types.UPDATE_RELATED_QUESTIONS, data)
        } catch (err) {
          // @todo: error handler, e.g. question not exist.
          console.log(err)
        }
      },
      async [types.FETCH_RELATED_BLOGS]({ commit }, id: number) {
        try {
          const { data } = await api.fetchRelatedBlogs(id)
          commit(types.UPDATE_RELATED_BLOGS, data)
        } catch (err) {
          // @todo: error handler, e.g. question not exist.
          console.log(err)
        }
      },
      [types.UPDATE_QUESTION_DROPDOWN_MENU_STATUS](
        { commit },
        data: DropdownMenu
      ) {
        commit(types.UPDATE_QUESTION_DROPDOWN_MENU_STATUS, data)
      },
      [types.OPEN_REPORT_PANEL]({ commit }, payload: Report) {
        commit(types.UPDATE_REPORT_PANEL_VISIBLE, payload)
      },
      [types.CLOSE_REPORT_PANEL]({ commit }) {
        commit(types.UPDATE_REPORT_PANEL_VISIBLE, {
          visible: false,
          questionId: null,
          answerId: null,
          comment: '',
        })
      },
      async [types.ADD_REPORT]({ state, commit }, comment: string) {
        const { questionId, answerId } = state.report
        try {
          if (answerId) {
            const { success } = await api.addAnswerReport({
              questionId: questionId!,
              answerId,
              comment,
            })
            const answerIndex = _.findIndex(
              state.answers,
              (answer) => answer.answer_id === answerId
            )
            commit(types.UPDATE_REPORT_STATUS, {
              answerIndex,
              reportStatus: true,
            })
            return success
          } else {
            const { success } = await api.addQuestionReport({
              questionId: questionId!,
              comment,
            })
            commit(types.UPDATE_REPORT_STATUS, {
              reportStatus: true,
            })
            return success
          }
        } catch (err) {
          const res = err.response.data as SimpleResponse
          return res
        }
      },
      async [types.CANCEL_REPORT](
        { state, commit },
        payload: CancelReportPayload
      ) {
        const { questionId, answerId } = payload
        try {
          if (answerId) {
            const { success } = await api.cancelAnswerReport({
              questionId: questionId!,
              answerId,
            })
            const answerIndex = _.findIndex(
              state.answers,
              (answer) => answer.answer_id === answerId
            )
            commit(types.UPDATE_REPORT_STATUS, {
              answerIndex,
              reportStatus: false,
            })
            return success
          } else {
            const { success } = await api.cancelQuestionReport({
              questionId: questionId!,
            })
            commit(types.UPDATE_REPORT_STATUS, {
              reportStatus: false,
            })
            return success
          }
        } catch (err) {
          const res = err.response.data as SimpleResponse
          return res
        }
      },
      async [types.FETCH_RECOMMEND_PRODUCT]({ commit }, id: number) {
        try {
          const { recommend_product } = await api.fetchRecommendProduct(id)
          commit(types.UPDATE_RECOMMEND_PRODUCT, recommend_product)
        } catch (err) {
          // @todo: error handler, e.g. question not exist.
          console.log(err)
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
          personalize: {
            ...DefaultAnswerPersonalize,
            is_owner: true,
          },
        })
        state.question!.question_meta.answer_count += 1
      },
      [types.UPDATE_NEW_RESPONSE](
        state,
        { answerIndex, data }: MutateResponsePayload
      ) {
        state.answers![answerIndex].responses.push(data)
        state.answers![answerIndex].answer_meta.response_count += 1
      },
      [types.UPDATE_LIKE_STATUS](
        state,
        { answerIndex, data, likeStatus }: MutateAnswerLikePayload
      ) {
        state.answers![answerIndex].answer_meta = data
        state.answers![answerIndex].personalize!.like_status = likeStatus
      },
      [types.UPDATE_RELATED_QUESTIONS](state, data: RelatedQuestion[]) {
        state.relatedQuestions = data
      },
      [types.UPDATE_RELATED_BLOGS](state, data: RelatedBlog[]) {
        state.relatedBlogs = data
      },
      [types.UPDATE_QUESTION_DROPDOWN_MENU_STATUS](state, data: DropdownMenu) {
        state.dropdownMenu = data
      },
      [types.UPDATE_REPORT_PANEL_VISIBLE](state, data: Partial<Report>) {
        state.report = {
          ...state.report,
          ...data,
        }
      },
      [types.UPDATE_REPORT_STATUS](
        state,
        { answerIndex, reportStatus }: MutateReportPayload
      ) {
        if (answerIndex) {
          state.answers![answerIndex].personalize!.is_reporter = reportStatus
        } else {
          state.question!.personalize!.is_reporter = reportStatus
        }
      },
      [types.UPDATE_RECOMMEND_PRODUCT](state, data: RecommendProduct | null) {
        state.recommendProduct = data
      },
    },
  }
}

export interface State {
  question: QuestionData | null
  answers: AnswerData[] | null
  recommendProduct: RecommendProduct | null
  relatedQuestions: RelatedQuestion[] | null
  relatedBlogs: RelatedBlog[] | null
  dropdownMenu: DropdownMenu
  report: Report
}

interface setQuestionBestAnswerPayload {
  questionId: number
  answerId: number
}

interface MutateResponsePayload {
  answerIndex: number
  data: ResponseData
}

interface MutateAnswerLikePayload {
  answerIndex: number
  data: AnswerMeta
  likeStatus: LikeStatus
}

interface MutateReportPayload {
  answerIndex?: number
  reportStatus: boolean
}

type CancelReportPayload = Omit<Report, 'visible'>

export interface DropdownMenu {
  visible: boolean
  top: number | null
  left: number | null
  disableBlur: boolean
  options: DropdownMenuOption[] | null
}

export interface DropdownMenuOption {
  title: string
  action: Function
}

export interface Report {
  visible: boolean
  questionId: number | null
  answerId: number | null
}
