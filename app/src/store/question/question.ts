import _ from 'lodash'
import { Module } from 'vuex'
import * as types from './question.type'
import { UPDATE_PAGE_META, UPDATE_JSON_LD } from '@/store/seo/seo.type'
import * as api from '@/api/question/question'
import { promiseSettledWrapper } from '@/utils/promise-settled'
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
  RecommendProduct,
  QuestionPersonalizeResponse,
  QuestionDataResponse,
} from '@/api/question/question.type'
import { SimpleResponse, RelatedQuestion, RelatedBlog } from '@/api/type'

export const DefaultQuestionPersonalize: QuestionPersonalize = {
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
      [types.FETCH_PAGE_DATA]({ commit }, id: number) {
        return new Promise<void>((resolve, reject) => {
          Promise.all([
            promiseSettledWrapper(api.fetchQuestionData(id)),
            promiseSettledWrapper(api.fetchAnswerData(id)),
            promiseSettledWrapper(api.fetchRelatedQuestions(id)),
            promiseSettledWrapper(api.fetchRelatedBlogs(id)),
            promiseSettledWrapper(api.fetchRecommendProduct(id)),
          ]).then(
            ([
              questionResponse,
              answersResponse,
              relatedQuestionsResponse,
              relatedBlogsResponse,
              recommendProductResponse,
            ]) => {
              if (questionResponse.status === 'fulfilled') {
                const {
                  data,
                  page_meta,
                  json_ld,
                } = questionResponse.value as QuestionDataResponse
                commit(types.UPDATE_QUESTION_DATA, {
                  ...data,
                  personalize: DefaultQuestionPersonalize,
                })
                commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                  root: true,
                })
                commit(`jsonLd/${UPDATE_JSON_LD}`, json_ld, { root: true })
              } else {
                reject(questionResponse.reason)
              }

              if (answersResponse.status === 'fulfilled') {
                const answerData = answersResponse.value.data.map((answer) => {
                  return {
                    ...answer,
                    personalize: DefaultAnswerPersonalize,
                  }
                })
                commit(types.UPDATE_ANSWER_DATA, answerData)
              } else {
                commit(types.UPDATE_ANSWER_DATA, null)
              }

              if (relatedQuestionsResponse.status === 'fulfilled') {
                commit(
                  types.UPDATE_RELATED_QUESTIONS,
                  relatedQuestionsResponse.value.data
                )
              }

              if (relatedBlogsResponse.status === 'fulfilled') {
                commit(
                  types.UPDATE_RELATED_BLOGS,
                  relatedBlogsResponse.value.data
                )
              }

              if (recommendProductResponse.status === 'fulfilled') {
                commit(types.UPDATE_RECOMMEND_PRODUCT, {
                  ...recommendProductResponse.value.recommend_product,
                  consultations_count:
                    recommendProductResponse.value.consultations_count || 0,
                })
              }
              resolve()
            }
          )
        })
      },
      [types.FETCH_PAGE_DATA_AFTER_POST]({ commit }, id: number) {
        return new Promise<void>((resolve) => {
          Promise.all([
            promiseSettledWrapper(api.fetchAnswerData(id)),
            promiseSettledWrapper(api.fetchRelatedQuestions(id)),
            promiseSettledWrapper(api.fetchRelatedBlogs(id)),
            promiseSettledWrapper(api.fetchRecommendProduct(id)),
          ]).then(
            ([
              answersResponse,
              relatedQuestionsResponse,
              relatedBlogsResponse,
              recommendProductResponse,
            ]) => {
              if (answersResponse.status === 'fulfilled') {
                const answerData = answersResponse.value.data.map((answer) => {
                  return {
                    ...answer,
                    personalize: DefaultAnswerPersonalize,
                  }
                })
                commit(types.UPDATE_ANSWER_DATA, answerData)
              } else {
                commit(types.UPDATE_ANSWER_DATA, null)
              }

              if (relatedQuestionsResponse.status === 'fulfilled') {
                commit(
                  types.UPDATE_RELATED_QUESTIONS,
                  relatedQuestionsResponse.value.data
                )
              }

              if (relatedBlogsResponse.status === 'fulfilled') {
                commit(
                  types.UPDATE_RELATED_BLOGS,
                  relatedBlogsResponse.value.data
                )
              }

              if (recommendProductResponse.status === 'fulfilled') {
                commit(
                  types.UPDATE_RECOMMEND_PRODUCT,
                  recommendProductResponse.value.recommend_product
                )
              }
              resolve()
            }
          )
        })
      },
      [types.HIGHLIGHT_BEST_ANSWER]({ commit }, bestAnswerId: number) {
        commit(types.UPDATE_TOP_ANSWER_ORDER, bestAnswerId)
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
      async [types.ADD_RESPONSE]({ commit }, payload: AddResponsePayload) {
        try {
          const res = await api.addResponse(payload)
          const { success, data } = res
          if (success) {
            commit(types.UPDATE_NEW_RESPONSE, {
              answerId: payload.answerId,
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
        { commit, dispatch },
        payload: UpdateLikeStatuePayload
      ) {
        try {
          const res = await api.likeAnswer(payload)
          const {
            success,
            answer_meta: data,
            like_status: likeStatus,
            personalize,
          } = res
          if (success) {
            commit(types.UPDATE_LIKE_STATUS, {
              answerId: payload.answerId,
              data,
              likeStatus,
            })

            if (likeStatus !== LikeStatus.DISLIKE && personalize) {
              dispatch(types.REMOVE_RESPONSE_DISLIKE_BADGE, {
                answerId: payload.answerId,
                responseIds: personalize.response_ids,
              })
            }
          } else {
            return res
          }
        } catch (err) {
          const res = err.response.data as AddResponseResponse
          return res
        }
      },
      [types.REMOVE_RESPONSE_DISLIKE_BADGE](
        { commit },
        payload: RemoveResponseDislikeBadge
      ) {
        if (payload.responseIds.length) {
          commit(types.REMOVE_RESPONSE_DISLIKE_BADGE, payload)
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
              commit(types.UPDATE_REPORT_STATUS, {
                answerId,
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
      async [types.CANCEL_REPORT]({ commit }, payload: CancelReportPayload) {
        const { questionId, answerId } = payload
        try {
          if (answerId) {
            const res = await api.cancelAnswerReport({
              questionId: questionId!,
              answerId,
            })
            const { success } = res

            if (success) {
              commit(types.UPDATE_REPORT_STATUS, {
                answerId,
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
    },
    mutations: {
      [types.UPDATE_QUESTION_DATA](state, data: QuestionData) {
        state.question = data
      },
      [types.UPDATE_ANSWER_DATA](state, data: AnswerData[] | null) {
        state.answers = data
      },
      [types.UPDATE_TOP_ANSWER_ORDER](state, bestAnswerId: number) {
        const bestAnswerIndex = _.findIndex(
          state.answers,
          (answer) => answer.answer_id === bestAnswerId
        )

        if (bestAnswerIndex >= 0) {
          const bestAnswer: AnswerData = state.answers!.splice(
            bestAnswerIndex,
            1
          )[0]
          state.answers!.unshift(bestAnswer)
        }
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
        { answerId, data }: MutateResponsePayload
      ) {
        const answerIndex = _.findIndex(
          state.answers,
          (answer) => answer.answer_id === answerId
        )

        state.answers![answerIndex].responses.push(data)
        state.answers![answerIndex].answer_meta.response_count += 1
      },
      [types.UPDATE_LIKE_STATUS](
        state,
        { answerId, data, likeStatus }: MutateAnswerLikePayload
      ) {
        const answerIndex = _.findIndex(
          state.answers,
          (answer) => answer.answer_id === answerId
        )

        state.answers![answerIndex].answer_meta = data
        state.answers![answerIndex].personalize!.like_status = likeStatus
      },
      [types.REMOVE_RESPONSE_DISLIKE_BADGE](
        state,
        { answerId, responseIds }: RemoveResponseDislikeBadge
      ) {
        const answerIndex = _.findIndex(
          state.answers,
          (answer) => answer.answer_id === answerId
        )

        state.answers![answerIndex].responses.forEach((response) => {
          if (responseIds.includes(response.response_id)) {
            response.is_dislike = false
          }
        })
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
        { answerId, reportStatus }: MutateReportPayload
      ) {
        const answerIndex = _.findIndex(
          state.answers,
          (answer) => answer.answer_id === answerId
        )

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

interface RemoveResponseDislikeBadge {
  answerId: number
  responseIds: number[]
}

interface MutateResponsePayload {
  answerId: number
  data: ResponseData
}

interface MutateAnswerLikePayload {
  answerId: number
  data: AnswerMeta
  likeStatus: LikeStatus
}

interface MutateReportPayload {
  answerId?: number
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
