import _ from 'lodash'
import { Module } from 'vuex'
import * as types from './question.type'
import { UPDATE_PAGE_META, UPDATE_JSON_LD } from '@/store/seo/seo.type'
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
  QuestionPersonalizeResponse,
  QuestionDataResponse,
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
      [types.FETCH_PAGE_DATA]({ dispatch }, id: number) {
        return new Promise((resolve, reject) => {
          Promise.all([
            dispatch(types.FETCH_QUESTION_DATA, id),
            dispatch(types.FETCH_ANSWER_DATA, id),
            dispatch(types.FETCH_RELATED_QUESTIONS, id),
            dispatch(types.FETCH_RELATED_BLOGS, id),
            dispatch(types.FETCH_RECOMMEND_PRODUCT, id),
          ])
            .then(() => {
              resolve()
            })
            .catch((err) => reject(err))
        })
      },
      [types.FETCH_PAGE_DATA_AFTER_POST]({ dispatch }, id: number) {
        return new Promise((resolve, reject) => {
          Promise.all([
            dispatch(types.FETCH_ANSWER_DATA, id),
            dispatch(types.FETCH_RELATED_QUESTIONS, id),
            dispatch(types.FETCH_RELATED_BLOGS, id),
            dispatch(types.FETCH_RECOMMEND_PRODUCT, id),
          ])
            .then(() => {
              resolve()
            })
            .catch((err) => reject(err))
        })
      },
      [types.FETCH_QUESTION_DATA]({ commit }, id: number) {
        return new Promise((resolve, reject) => {
          api
            .fetchQuestionData(id)
            .then((res) => {
              const {
                data: questionData,
                page_meta,
                json_ld,
              } = res as QuestionDataResponse
              commit(types.UPDATE_QUESTION_DATA, questionData)
              commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                root: true,
              })
              commit(`jsonLd/${UPDATE_JSON_LD}`, json_ld, { root: true })
              resolve()
            })
            .catch((err) => reject(err))
        })
      },
      [types.FETCH_ANSWER_DATA]({ commit }, id: number) {
        return new Promise((resolve) => {
          api
            .fetchAnswerData(id)
            .then(({ data: answers }) => {
              commit(types.UPDATE_ANSWER_DATA, answers)
              resolve()
            })
            .catch(() => resolve())
        })
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
          const res = await api.fetchQuestionPersonalizeData(id)
          commit(
            types.UPDATE_QUESTION_PERSONALIZE_DATA,
            (res as QuestionPersonalizeResponse).personalize
          )
        } catch (err) {}
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
        } catch (err) {}
      },
      async [types.FOLLOW_QUESTION]({ commit }, id: number) {
        try {
          const { success } = await api.followQuestion(id)
          if (success) {
            commit(types.UPDATE_QUESTION_FOLLOW_STATE, true)
          } else {
            return success
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
          } else {
            return success
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
          } else {
            return success
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
          } else {
            return success
          }
          return success
        } catch (err) {
          const { success } = err.response.data as UnsetBestAnswerResponse
          return success
        }
      },
      async [types.ADD_ANSWER]({ commit }, payload: AddAnswerPayload) {
        try {
          const res = await api.addAnswer(payload)
          const { success, data } = res
          if (success) {
            commit(types.UPDATE_NEW_ANSWER, data)
            return data!.answer_id
          } else {
            return res
          }
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
          const res = await api.addResponse(payload)
          const { success, data } = res
          if (success) {
            const answerIndex = _.findIndex(
              state.answers,
              (answer) => answer.answer_id === payload.answerId
            )

            commit(types.UPDATE_NEW_RESPONSE, {
              answerIndex,
              data,
            })
            return data!.response_id
          } else {
            return res
          }
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
          const res = await api.likeAnswer(payload)
          const { success, answer_meta: data, like_status: likeStatus } = res
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
          } else {
            return res
          }
        } catch (err) {
          const res = err.response.data as AddResponseResponse
          return res
        }
      },
      [types.FETCH_RELATED_QUESTIONS]({ commit }, id: number) {
        return new Promise((resolve) => {
          api
            .fetchRelatedQuestions(id)
            .then(({ data: relatedQuestion }) => {
              commit(types.UPDATE_RELATED_QUESTIONS, relatedQuestion)
              resolve()
            })
            .catch(() => resolve())
        })
      },
      [types.FETCH_RELATED_BLOGS]({ commit }, id: number) {
        return new Promise((resolve) => {
          api
            .fetchRelatedBlogs(id)
            .then(({ data: relatedBlogs }) => {
              commit(types.UPDATE_RELATED_BLOGS, relatedBlogs)
              resolve()
            })
            .catch(() => resolve())
        })
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
        })
      },
      async [types.ADD_REPORT]({ state, commit }, comment: string) {
        const { questionId, answerId } = state.report
        try {
          if (answerId) {
            const res = await api.addAnswerReport({
              questionId: questionId!,
              answerId,
              comment,
            })
            const { success } = res

            if (success) {
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
              return res
            }
          } else {
            const res = await api.addQuestionReport({
              questionId: questionId!,
              comment,
            })
            const { success } = res

            if (success) {
              commit(types.UPDATE_REPORT_STATUS, {
                reportStatus: true,
              })
              return success
            } else {
              return res
            }
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
            const res = await api.cancelAnswerReport({
              questionId: questionId!,
              answerId,
            })
            const { success } = res

            if (success) {
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
              return res
            }
          } else {
            const res = await api.cancelQuestionReport({
              questionId: questionId!,
            })
            const { success } = res

            if (success) {
              commit(types.UPDATE_REPORT_STATUS, {
                reportStatus: false,
              })
              return success
            } else {
              return res
            }
          }
        } catch (err) {
          const res = err.response.data as SimpleResponse
          return res
        }
      },
      [types.FETCH_RECOMMEND_PRODUCT]({ commit }, id: number) {
        return new Promise((resolve) => {
          api
            .fetchRecommendProduct(id)
            .then(({ recommend_product: recommendProducts }) => {
              commit(types.UPDATE_RECOMMEND_PRODUCT, recommendProducts)
              resolve()
            })
            .catch(() => resolve())
        })
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
      [types.UPDATE_REPORT_PANEL_VISIBLE](state, data: Report) {
        state.report = data
      },
      [types.UPDATE_REPORT_STATUS](
        state,
        { answerIndex, reportStatus }: MutateReportPayload
      ) {
        if (typeof answerIndex !== 'undefined') {
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
