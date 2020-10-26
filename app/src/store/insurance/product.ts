import { Module } from 'vuex'
import * as types from './product.type'
import { UPDATE_PAGE_META, UPDATE_JSON_LD } from '@/store/seo/seo.type'
import * as api from '@/api/insurance/product'
import { Product } from '@/api/insurance/product.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        id: '',
        product: null,
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
    },
  }
}

export interface State {
  id: string
  product: Product | null
}
