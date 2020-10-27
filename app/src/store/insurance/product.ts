import { Module } from 'vuex'
import * as types from './product.type'
import { UPDATE_PAGE_META, UPDATE_JSON_LD } from '@/store/seo/seo.type'
import * as api from '@/api/insurance/product'
import { Product, PremiumQuery } from '@/api/insurance/product.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        id: '',
        fee: 0,
        product: null,
        premiumQuery: null,
      }
    },
    getters: {},
    actions: {
      [types.FETCH_PRODUCT]({ commit }, id: string) {
        return new Promise((resolve, reject) => {
          api
            .fetchProduct(id)
            .then(({ data, page_meta, json_ld }) => {
              commit(types.UPDATE_PRODUCT, data)
              commit(types.UPDATE_PRODUCT_ID, id)
              commit(types.UPDATE_PREMIUM_QUERY, {
                productId: id,
                age: data.default_premium_config.age,
                gender: data.default_premium_config.gender,
                planId: data.default_premium_config.plan_id,
                jobLevel: data.default_premium_config.job_level,
                amount: data.default_premium_config.amount,
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
    },
    mutations: {
      [types.UPDATE_PRODUCT](state, data: Product) {
        state.product = data
      },
      [types.UPDATE_PRODUCT_ID](state, id: string) {
        state.id = id
      },
      [types.UPDATE_PREMIUM_QUERY](state, query: PremiumQuery) {
        state.premiumQuery = query
      },
      [types.UPDATE_FEE](state, fee: number) {
        state.fee = fee
      },
    },
  }
}

export interface State {
  id: string
  fee: number
  product: Product | null
  premiumQuery: PremiumQuery | null
}
