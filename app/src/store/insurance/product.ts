import { Module } from 'vuex'
import * as api from '@/api/insurance/product'
import { SingleProductResponse } from '@/api/insurance/product.type'
import * as types from './product.type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        id: '', // TODO: 後續要刪除
        fee: 0,
        singleProduct: null,
        selectedCaseIndex: 0,
        insuredAmount: 0,
      }
    },
    actions: {
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
      [types.UPDATE_FEE](state, fee: number) {
        state.fee = fee
      },
      [types.UPDATE_SINGLE_PRODUCT](state, data: SingleProductResponse) {
        state.singleProduct = data
      },
      [types.UPDATE_SELECTED_CASE_INDEX](state, index: number) {
        state.selectedCaseIndex = index
      },
      [types.UPDATE_INSURED_AMOUNT](state, amount: number) {
        state.insuredAmount = amount
      },
    },
  }
}

export interface State {
  id: string
  fee: number | null
  singleProduct: SingleProductResponse | null
  selectedCaseIndex: number
  insuredAmount: number
}

export interface UpdatePremiumQueryPayload {
  id: string
  value: string | number
}
