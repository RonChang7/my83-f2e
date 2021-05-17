import _ from 'lodash'
import { Module } from 'vuex'
import { UPDATE_PAGE_META, UPDATE_JSON_LD } from '@/store/seo/seo.type'
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
  FilterValue,
  FilterOption,
  ProductFeeList,
  InsuranceListFilterResponse,
  FetchInsuranceSearchListPayload,
} from '@/api/insurance/insurance.type'
import { RecommendProduct } from '@/api/question/question.type'
import {
  RelatedBlog,
  RelatedQuestion,
  Pagination,
  LinkButton,
} from '@/api/type'
import { paginationResponseDataTransform } from '@/utils/api-data-transform'
import { externalInsuranceRouteNames } from '@/routes/insurance'
import * as types from './insurance.type'

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
          isExternal: false,
          image: '',
          description: '',
          promotionWording: '',
          productListDescription: '',
          glossary: null,
          principle: null,
          faq: null,
        },
        title: '',
        description: '',
        announcement: null,
        relatedBlogs: null,
        relatedQuestions: null,
        promotionProducts: null,
        recommendProducts: null,
        insuranceList: null,
        insuranceIdealCoverages: null,
        filter: {
          defaultValue: null,
          config: null,
        },
      }
    },
    getters: {},
    actions: {
      [types.FETCH_PAGE_DATA]({ dispatch, commit }, insurance: string) {
        return new Promise<void>((resolve) => {
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
            .catch(() => resolve())
        })
      },
      [types.FETCH_INSURANCE_LIST](
        { commit },
        payload: FetchInsuranceListPayload
      ) {
        return new Promise<void>((resolve, reject) => {
          api
            .fetchInsuranceList(payload)
            .then(({ data, meta, page_meta, json_ld }) => {
              commit(types.UPDATE_INSURANCE_LIST_DATA, {
                insurance: payload.insurance,
                data,
              })
              commit(types.UPDATE_INSURANCE_LIST_META, meta)
              commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                root: true,
              })
              commit(`jsonLd/${UPDATE_JSON_LD}`, json_ld, { root: true })
              commit(types.UPDATE_CURRENT_PAGE, payload.page)
              resolve()
            })
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_INSURANCE_LIST_FILTER]({ commit }, insurance: string) {
        return new Promise<void>((resolve, reject) => {
          api
            .fetchInsuranceListFilter(insurance)
            .then((data) => {
              commit(types.UPDATE_INSURANCE_LIST_FILTER, data)
              resolve()
            })
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_INSURANCE_SEARCH_LIST](
        { commit },
        payload: FetchInsuranceSearchListPayload
      ) {
        return new Promise<void>((resolve, reject) => {
          api
            .fetchInsuranceSearchList(payload)
            .then(({ data, meta, page_meta, json_ld }) => {
              commit(types.UPDATE_INSURANCE_LIST_DATA, {
                insurance: '',
                data,
              })
              commit(types.UPDATE_INSURANCE_LIST_META, meta)
              commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                root: true,
              })
              commit(`jsonLd/${UPDATE_JSON_LD}`, json_ld, { root: true })
              commit(types.UPDATE_CURRENT_PAGE, payload.page)
              resolve()
            })
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_INSURANCE_SEARCH_LIST_FILTER]({ commit }, q: string) {
        return new Promise<InsuranceListFilterResponse>((resolve, reject) => {
          api
            .fetchInsuranceSearchListFilter(q)
            .then((data) => {
              commit(types.UPDATE_INSURANCE_LIST_FILTER, data)
              commit(types.UPDATE_PROMOTION_PRODUCTS, [])
              commit(types.UPDATE_RECOMMEND_PRODUCTS, [])
              resolve(data)
            })
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_SEARCH_NO_RESULT]({ commit }) {
        return new Promise<void>((resolve) => {
          api
            .fetchSearchNoResult()
            .then((data) => {
              commit(types.UPDATE_PROMOTION_PRODUCTS, data.promotion_products)
              commit(types.UPDATE_RECOMMEND_PRODUCTS, data.recommend_products)
              resolve()
            })
            .catch(() => resolve())
        })
      },
      [types.FETCH_TAG_LIST]({ commit }, payload: FetchInsuranceListPayload) {
        return new Promise<void>((resolve, reject) => {
          api
            .fetchInsuranceTagList(payload)
            .then(({ data, meta, page_meta, json_ld }) => {
              commit(types.UPDATE_INSURANCE_LIST_DATA, {
                insurance: payload.insurance,
                data,
              })
              commit(types.UPDATE_INSURANCE_LIST_META, meta)
              commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                root: true,
              })
              commit(`jsonLd/${UPDATE_JSON_LD}`, json_ld, { root: true })
              commit(types.UPDATE_CURRENT_PAGE, payload.page)
              resolve()
            })
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_TAG_LIST_FILTER]({ commit }, insurance: string) {
        return new Promise<void>((resolve, reject) => {
          api
            .fetchInsuranceTagListFilter(insurance)
            .then((data) => {
              commit(types.UPDATE_INSURANCE_LIST_FILTER, data)
              resolve()
            })
            .catch((error) => reject(error))
        })
      },
      [types.UPDATE_INSURANCE_PRODUCT_FEE](
        { state, commit },
        payload: FilterValue
      ) {
        const productListIds =
          state.insuranceList?.map((product) => product.id) || []
        const promotionProductIds =
          state.promotionProducts?.map((product) => product.id) || []

        return new Promise<void>((resolve) => {
          api
            .updateInsuranceProductFee(
              [...productListIds, ...promotionProductIds],
              payload
            )
            .then(({ data }) => {
              commit(
                types.UPDATE_INSURANCE_LIST_PRODUCT_FEE,
                data.product_fee_list
              )
              commit(types.UPDATE_PROMOTION_PRODUCT_FEE, data.product_fee_list)
              commit(types.UPDATE_CURRENT_FILTER_CONFIG, payload)
              resolve()
            })
            .catch((error) => {
              console.error(`Cannot update product price via filter.`, error)
              resolve()
            })
        })
      },
      [types.FETCH_STATIC_DATA](_, insurance: string) {
        return new Promise<InsurancePageStaticData | void>((resolve) => {
          api
            .fetchInsurancePageStaticData({
              host: this.$env.HOST_URL as string,
              insurance,
            })
            .then((data) => resolve(data))
            .catch(() => resolve())
        })
      },
      [types.FETCH_PROMOTION_PRODUCTS](_, insurance: string) {
        return new Promise<PromotionInsuranceProduct[] | void>((resolve) => {
          api
            .fetchPromotionProducts(insurance)
            .then(({ data }) => resolve(data))
            .catch(() => resolve())
        })
      },
      [types.FETCH_RELATED_BLOGS](_, insurance: string) {
        return new Promise<RelatedBlog[] | void>((resolve) => {
          api
            .fetchRelatedBlogs(insurance)
            .then(({ data }) => resolve(data))
            .catch(() => resolve())
        })
      },
      [types.FETCH_RELATED_QUESTIONS](_, insurance: string) {
        return new Promise<RelatedQuestion[] | void>((resolve) => {
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
        state.staticData.queryForMoreQuestion =
          data.query_for_more_question || data.name
        state.staticData.isExternal = data.is_external || false
        state.staticData.image = data.image
        state.staticData.description = data.description
        state.staticData.promotionWording = data.promotion_wording || ''
        state.staticData.productListDescription =
          data.product_list_description || ''
        state.staticData.glossary = data.glossary
        state.staticData.principle = data.principle
        state.staticData.faq = data.faq
      },
      [types.UPDATE_INSURANCE_LIST_DATA](
        state,
        { insurance, data }: { insurance: string; data: InsuranceListData }
      ) {
        state.staticData.id = insurance
        state.title = data.title
        state.description = data.description
        state.announcement = data.announcement_btn
        state.insuranceList = data.products
        state.insuranceIdealCoverages = data.ideal_coverages
        if (externalInsuranceRouteNames.includes(insurance)) {
          state.filter.config = data.premium_config
          state.filter.defaultValue = data.default_premium_config
        }
      },
      [types.UPDATE_INSURANCE_LIST_META](state, meta: InsuranceListMeta) {
        state.meta = {
          pagination: paginationResponseDataTransform(meta.pagination),
          currentFilterConfig: meta.current_filter_config,
        }
      },
      [types.UPDATE_CURRENT_FILTER_CONFIG](state, config: FilterValue) {
        if (state.meta) {
          state.meta.currentFilterConfig = _.reduce(
            config,
            (result, value, key) => {
              result[key] = _.isArray(value)
                ? value.map((_) => _.toString())
                : value.toString()

              return result
            },
            {} as Record<string, string | string[]>
          )
        }
      },
      [types.UPDATE_INSURANCE_LIST_FILTER](
        state,
        data: InsuranceListFilterResponse
      ) {
        state.filter.config = data.filter_config
        state.filter.defaultValue = data.default_filter_config
      },
      [types.UPDATE_INSURANCE_LIST_PRODUCT_FEE](
        state,
        payload: ProductFeeList[]
      ) {
        payload.forEach(({ product_id, fee }) => {
          const index = state.insuranceList!.findIndex(
            (product) => product.id === product_id
          )
          if (index >= 0) {
            state.insuranceList![index].fee = fee
          }
        })
      },
      [types.UPDATE_PROMOTION_PRODUCT_FEE](state, payload: ProductFeeList[]) {
        payload.forEach(({ product_id, fee }) => {
          const index = state.promotionProducts!.findIndex(
            (product) => product.id === product_id
          )
          if (index >= 0) {
            state.promotionProducts![index].fee = fee
          }
        })
      },
      [types.UPDATE_PROMOTION_PRODUCTS](
        state,
        data: PromotionInsuranceProduct[]
      ) {
        state.promotionProducts = data
      },
      [types.UPDATE_RECOMMEND_PRODUCTS](state, data: RecommendProduct[]) {
        state.recommendProducts = data
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
  currentParam: CurrentParam
  meta: {
    pagination: Pagination
    currentFilterConfig: Record<string, string | string[]>
  } | null
  staticData: {
    id: string
    abbr: string
    queryForMoreQuestion: string
    isExternal: boolean
    image: string
    description: string
    promotionWording: string
    productListDescription: string
    glossary: Glossary | null
    principle: Principle | null
    faq: Faq[] | null
  }
  title: string
  description: string
  announcement: LinkButton | null
  relatedQuestions: RelatedQuestion[] | null
  relatedBlogs: RelatedBlog[] | null
  promotionProducts: PromotionInsuranceProduct[] | null
  recommendProducts: RecommendProduct[] | null
  insuranceList: InsuranceProduct[] | null
  insuranceIdealCoverages: IdealCoverage[] | null
  filter: {
    defaultValue: FilterValue | null
    config: Record<string, FilterOption> | null
  }
}

export interface CurrentParam extends FilterValue {
  page: number
}

export interface UpdateInsuranceListFilterPayload {
  id: string
  value: string | number | undefined
}
