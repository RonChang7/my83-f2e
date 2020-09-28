import { Module } from 'vuex'
import * as types from './insurance.type'
import * as api from '@/api/insurance/insurance'
import {
  InsurancePageStaticData,
  Glossary,
  Principle,
  Faq,
  PromotionInsuranceProduct,
} from '@/api/insurance/insurance.type'
import { RelatedBlog, RelatedQuestion } from '@/api/type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        id: '',
        abbr: '',
        queryForMoreQuestion: '',
        image: '',
        description: '',
        glossary: null,
        principle: null,
        faq: null,
        relatedBlogs: null,
        relatedQuestions: null,
        promotionProducts: null,
      }
    },
    getters: {},
    actions: {
      [types.FETCH_PAGE_DATA]({ dispatch, commit }, insurance: string) {
        return new Promise((resolve, reject) => {
          Promise.all([
            dispatch(types.FETCH_STATIC_DATA, insurance),
            dispatch(types.FETCH_PROMOTION_PRODUCTS, insurance),
            dispatch(types.FETCH_RELATED_BLOGS, insurance),
            dispatch(types.FETCH_RELATED_QUESTIONS, insurance),
          ])
            .then(
              ([
                insuranceStaticData,
                promotionProducts,
                relatedBlogs,
                relatedQuestions,
              ]) => {
                commit(types.UPDATE_STATIC_DATA, insuranceStaticData)
                commit(types.UPDATE_PROMOTION_PRODUCTS, promotionProducts)
                commit(types.UPDATE_RELATED_BLOGS, relatedBlogs)
                commit(types.UPDATE_RELATED_QUESTIONS, relatedQuestions)
                resolve()
              }
            )
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_STATIC_DATA](_, insurance: string) {
        return new Promise((resolve, reject) => {
          api
            .fetchInsurancePageStaticData({
              host: this.$env.HOST_URL as string,
              insurance,
            })
            .then((data) => resolve(data))
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_PROMOTION_PRODUCTS](_, insurance: string) {
        return new Promise((resolve) => {
          api
            .fetchPromotionProducts(insurance)
            .then(({ data }) => resolve(data))
            .catch(() => resolve())
        })
      },
      [types.FETCH_RELATED_BLOGS](_, insurance: string) {
        return new Promise((resolve) => {
          api
            .fetchRelatedBlogs(insurance)
            .then(({ data }) => resolve(data))
            .catch(() => resolve())
        })
      },
      [types.FETCH_RELATED_QUESTIONS](_, insurance: string) {
        return new Promise((resolve) => {
          api
            .fetchRelatedQuestions(insurance)
            .then(({ data }) => resolve(data))
            .catch(() => resolve())
        })
      },
    },
    mutations: {
      [types.UPDATE_STATIC_DATA](state, data: InsurancePageStaticData) {
        state.id = data.id
        state.abbr = data.name
        state.queryForMoreQuestion = data.query_for_more_question
        state.image = data.image
        state.description = data.description
        state.glossary = data.glossary
        state.principle = data.principle
        state.faq = data.faq
      },
      [types.UPDATE_PROMOTION_PRODUCTS](
        state,
        data: PromotionInsuranceProduct[]
      ) {
        state.promotionProducts = data
      },
      [types.UPDATE_RELATED_BLOGS](state, data: RelatedBlog[]) {
        state.relatedBlogs = data
      },
      [types.UPDATE_RELATED_QUESTIONS](state, data: RelatedQuestion[]) {
        state.relatedQuestions = data
      },
    },
  }
}

export interface State {
  id: string
  abbr: string
  queryForMoreQuestion: string
  image: string
  description: string
  glossary: Glossary | null
  principle: Principle | null
  faq: Faq[] | null
  relatedQuestions: RelatedQuestion[] | null
  relatedBlogs: RelatedBlog[] | null
  promotionProducts: PromotionInsuranceProduct[] | null
}
