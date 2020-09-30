import { Module } from 'vuex'
import * as types from './insurance.type'
import { UPDATE_PAGE_META } from '@/store/seo/seo.type'
import * as api from '@/api/insurance/insurance'
import {
  InsurancePageStaticData,
  Glossary,
  Principle,
  Faq,
  PromotionInsuranceProduct,
  FetchInsuranceListPayload,
  InsuranceListData,
  InsuranceProduct,
  IdealCoverage,
  InsuranceListMeta,
} from '@/api/insurance/insurance.type'
import { RelatedBlog, RelatedQuestion, Pagination } from '@/api/type'
import { paginationResponseDataTransform } from '@/utils/api-data-transform'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        currentParam: {
          page: 0,
        },
        meta: null,
        staticData: {
          id: '',
          abbr: '',
          queryForMoreQuestion: '',
          image: '',
          description: '',
          glossary: null,
          principle: null,
          faq: null,
        },
        title: '',
        relatedBlogs: null,
        relatedQuestions: null,
        promotionProducts: null,
        insuranceList: null,
        insuranceIdealCoverages: null,
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
      [types.FETCH_INSURANCE_LIST](
        { commit },
        payload: FetchInsuranceListPayload
      ) {
        return new Promise((resolve, reject) => {
          api
            .fetchInsuranceList(payload)
            .then(({ data, meta, page_meta }) => {
              commit(types.UPDATE_INSURANCE_LIST_DATA, data)
              commit(types.UPDATE_INSURANCE_LIST_META, meta)
              commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                root: true,
              })
              commit(types.UPDATE_CURRENT_PAGE, payload.page)
              resolve()
            })
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
        state.staticData.id = data.id
        state.staticData.abbr = data.name
        state.staticData.queryForMoreQuestion = data.query_for_more_question
        state.staticData.image = data.image
        state.staticData.description = data.description
        state.staticData.glossary = data.glossary
        state.staticData.principle = data.principle
        state.staticData.faq = data.faq
      },
      [types.UPDATE_INSURANCE_LIST_DATA](state, data: InsuranceListData) {
        state.title = data.title
        data.ideal_coverages &&
          (state.insuranceIdealCoverages = data.ideal_coverages)

        state.insuranceList = data.products
      },
      [types.UPDATE_INSURANCE_LIST_META](state, meta: InsuranceListMeta) {
        state.meta = {
          pagination: paginationResponseDataTransform(meta.pagination),
        }
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
      [types.UPDATE_CURRENT_PAGE](state, page: number) {
        state.currentParam.page = page
      },
    },
  }
}

export interface State {
  currentParam: {
    page: number
  }
  meta: {
    pagination: Pagination
  } | null
  staticData: {
    id: string
    abbr: string
    queryForMoreQuestion: string
    image: string
    description: string
    glossary: Glossary | null
    principle: Principle | null
    faq: Faq[] | null
  }
  title: string
  relatedQuestions: RelatedQuestion[] | null
  relatedBlogs: RelatedBlog[] | null
  promotionProducts: PromotionInsuranceProduct[] | null
  insuranceList: InsuranceProduct[] | null
  insuranceIdealCoverages: IdealCoverage[] | null
}
