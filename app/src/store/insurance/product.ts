import _ from 'lodash'
import { Module } from 'vuex'
import * as types from './product.type'
import { UPDATE_PAGE_META, UPDATE_JSON_LD } from '@/store/seo/seo.type'
import * as api from '@/api/insurance/product'
import { Product, PremiumQuery, Coverage } from '@/api/insurance/product.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        id: '',
        fee: 0,
        product: null,
        premiumQuery: null,
        fieldValidated: {},
      }
    },
    getters: {
      isFieldValidated: (state) =>
        _.values(state.fieldValidated).every((value) => value),
    },
    actions: {
      [types.FETCH_PRODUCT]({ commit }, id: string) {
        return new Promise((resolve, reject) => {
          api
            .fetchProduct(id)
            .then(({ data, page_meta, json_ld }) => {
              commit(types.UPDATE_PRODUCT, data)
              commit(types.UPDATE_PRODUCT_ID, id)
              commit(types.UPDATE_PREMIUM_QUERY, {
                age: data.default_premium_config.age,
                gender: data.default_premium_config.gender,
                plan: data.default_premium_config.plan_id,
                jobLevel: data.default_premium_config.job_level,
                amount: data.default_premium_config.amount,
                amountUnit: data.default_premium_config.amount_unit,
              })
              commit(types.UPDATE_FEE, data.default_premium_config.fee)
              commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta, {
                root: true,
              })
              commit(`jsonLd/${UPDATE_JSON_LD}`, json_ld, { root: true })
              resolve()
            })
            .catch((error) => reject(error))
        })
      },
      [types.FETCH_PRODUCT_FEE]({ commit, state }) {
        return new Promise((resolve) => {
          api
            .fetchProductFee({
              productId: state.id,
              ...(state.premiumQuery as PremiumQuery),
            })
            .then(({ data }) => {
              commit(types.UPDATE_FEE, data.fee)
              if (data.coverages) {
                commit(types.UPDATE_COVERAGE, data.coverages)
              }
              resolve()
            })
            .catch(() => {
              commit(types.UPDATE_FEE, -1)

              resolve()
            })
        })
      },
      [types.UPDATE_PREMIUM_QUERY_KEY](
        { commit, state },
        payload: UpdatePremiumQueryPayload
      ) {
        if (state.premiumQuery?.[payload.id] !== payload.value) {
          commit(types.UPDATE_PREMIUM_QUERY_KEY, {
            [payload.id]: payload.value,
          })
        }
      },
      [types.UPDATE_PREMIUM_QUERY_VALIDATE](
        { commit },
        payload: UpdatePremiumQueryValidatePayload
      ) {
        commit(types.UPDATE_PREMIUM_QUERY_VALIDATE, payload)
      },
    },
    mutations: {
      [types.UPDATE_PRODUCT](state, data: Product) {
        state.product = data
      },
      [types.UPDATE_PRODUCT_ID](state, id: string) {
        state.id = id
      },
      [types.UPDATE_PREMIUM_QUERY](state, query: PremiumQuery) {
        state.premiumQuery = _.omitBy<PremiumQuery>(
          query,
          _.isUndefined
        ) as PremiumQuery
      },
      [types.UPDATE_PREMIUM_QUERY_KEY](
        state,
        payload: {
          [K in keyof PremiumQuery]: PremiumQuery[K]
        }
      ) {
        state.premiumQuery = {
          ...state.premiumQuery,
          ...payload,
        }
      },
      [types.UPDATE_PREMIUM_QUERY_VALIDATE](
        state,
        payload: Partial<Record<keyof PremiumQuery, boolean>>
      ) {
        state.fieldValidated = {
          ...state.fieldValidated,
          ...payload,
        }
      },
      [types.UPDATE_FEE](state, fee: number) {
        state.fee = fee
      },
      [types.UPDATE_COVERAGE](state, coverages: Coverage[]) {
        state.product!.coverages = coverages
      },
    },
  }
}

export interface State {
  id: string
  fee: number
  product: Product | null
  premiumQuery: PremiumQuery | null
  fieldValidated: Partial<Record<keyof PremiumQuery, boolean>>
}

export interface UpdatePremiumQueryPayload {
  id: string
  value: string | number
}

export interface UpdatePremiumQueryValidatePayload {
  id: string
  value: boolean
}
