import { Module } from 'vuex'
import * as types from './seo.type'
import { PageMeta } from '@/api/type'

export const createStoreModule = <R>(): Module<State, R> => {
  return {
    namespaced: true,
    state() {
      return {
        pageMeta: null,
      }
    },
    getters: {
      title: (state) => state.pageMeta?.title || 'MY83 保險網－把保險變簡單',
      description: (state) =>
        state.pageMeta?.description ||
        'MY83 把保險變簡單，幫助你讓生活更有保障。保險其實是很好的概念，能減輕遭遇風險時的負擔。MY83 不是保險業務員，也和任何保險公司無關，保戶在這裡使用任何資源都是免費的。我們從保戶的立場成立保險媒合平台，希望讓大家有能力可以分辨適合自己的保險。幫助消費者保險買對不買貴，也讓專業的業務員服務更多的消費者！',
      keywords: (state) =>
        state.pageMeta?.keywords ||
        '保險,媒合,保單,罐頭,業務員,投保,諮詢,醫療險,壽險,重大疾病險,癌症險,意外險,失能扶助險,失能險,儲蓄險,irr,健診,國泰人壽,富邦人壽,南山人壽',
      imageUrl: (state) =>
        state.pageMeta?.image?.url ||
        'https://images.my83.com.tw/front/seo/og-image.png',
      imageType: (state) => state.pageMeta?.image?.type || 'image/png',
      imageAlt: (state) =>
        state.pageMeta?.image?.alt || 'MY83 保險網－把保險變簡單',
      imageWidth: (state) => state.pageMeta?.image?.width || 704,
      imageHeight: (state) => state.pageMeta?.image?.height || 284,
    },
    actions: {
      [types.UPDATE_PAGE_META]({ commit }, data: PageMeta) {
        commit(types.UPDATE_PAGE_META, data)
      },
    },
    mutations: {
      [types.UPDATE_PAGE_META](state, data: PageMeta) {
        state.pageMeta = data
      },
    },
  }
}

export interface State {
  pageMeta: PageMeta | null
}
