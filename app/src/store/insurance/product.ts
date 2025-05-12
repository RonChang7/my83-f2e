import { Module } from 'vuex'
import { UPDATE_PAGE_META, UPDATE_JSON_LD } from '@/store/seo/seo.type'
import * as api from '@/api/insurance/product'
import {
  Product,
  Coverage,
  SingleProductResponse,
} from '@/api/insurance/product.type'
import * as types from './product.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        id: '',
        fee: 0,
        product: null,
        singleProduct: null,
      }
    },
    actions: {
      [types.FETCH_PRODUCT]({ commit }, id: string) {
        return new Promise<void>((resolve, reject) => {
          api
            .fetchProduct(id)
            .then(({ data, page_meta, json_ld }) => {
              commit(types.UPDATE_PRODUCT, data)
              commit(types.UPDATE_PRODUCT_ID, id)
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
      [types.FETCH_SINGLE_PRODUCT]({ commit }, productName: string) {
        return new Promise<void>((resolve, reject) => {
          api
            .fetchSingleProduct(productName)
            .then((data) => {
              commit(types.UPDATE_SINGLE_PRODUCT, data)
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
      [types.UPDATE_FEE](state, fee: number) {
        state.fee = fee
      },
      [types.CLEAR_FEE](state) {
        state.fee = null
      },
      [types.UPDATE_COVERAGE](state, coverages: Coverage[]) {
        state.product!.coverages = coverages
      },
      [types.UPDATE_SINGLE_PRODUCT](state, data: SingleProductResponse) {
        state.singleProduct = data
      },
    },
  }
}

export interface State {
  id: string
  fee: number | null
  product: Product | null
  singleProduct: SingleProductResponse | null
}

export interface UpdatePremiumQueryPayload {
  id: string
  value: string | number
}

export interface UpdatePremiumQueryValidatePayload {
  id: string
  value: boolean
}
