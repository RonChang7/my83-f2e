import _ from 'lodash'
import request from '@/api/request'
import { decorateSeoQueryString } from '@/api/decorate-seo-to-api'
import {
  InsurancePageStaticData,
  FetchInsurancePageStaticDataPayload,
  RelatedBlogsResponse,
  RelatedQuestionsResponse,
  PromotionInsuranceProductResponse,
  InsuranceListResponse,
  FetchInsuranceListPayload,
  InsuranceProductFeeResponse,
  InsuranceListFilterResponse,
  FilterValue,
  FetchInsuranceSearchListPayload,
  SearchNoResultResponse,
  InsuranceOptionsResponse,
} from './insurance.type'

const filtersTransformer = (filters: FetchInsuranceListPayload['filters']) => {
  if (filters === null) return {}

  return _.reduce(
    filters,
    (result, value, key) => {
      result[key] = typeof value === 'string' || typeof value === 'number' ? value : value.join(',')
      return result
    },
    {}
  )
}

/**
 * @description 取得險種頁靜態資料
 * @param {string} host Nuxt server host name
 * @param {string} insurance 險種名
 */
export const fetchInsurancePageStaticData = async ({
  host,
  insurance,
}: FetchInsurancePageStaticDataPayload): Promise<InsurancePageStaticData> => {
  if (process.server) {
    // eslint-disable-next-line no-undef
    const fs = __non_webpack_require__('fs')
    const data = JSON.parse(
      fs.readFileSync(`src/static/static/insurance/${insurance}.json`, 'utf8')
    )
    return data
  }

  const { data } = await request.get(`${host}/static/insurance/${insurance}.json`)
  return data
}

/**
 * @description 取得險種推薦商品
 * @param {string} insurance 險種名
 */
export const fetchPromotionProducts = async (
  insurance: string
): Promise<PromotionInsuranceProductResponse> => {
  const { data } = await request.get<PromotionInsuranceProductResponse>(
    `/api/insurance/${insurance}/promotion-products`
  )
  return data
}

/**
 * @description 取得險種商品
 * @param {FetchInsuranceListPayload} payload
 */
export const fetchInsuranceList = async (
  payload: FetchInsuranceListPayload
): Promise<InsuranceListResponse> => {
  const { insurance, page, filters } = payload

  const { data } = await request.get<InsuranceListResponse>(
    decorateSeoQueryString(`/api/insurance/${insurance}/products`),
    {
      params: {
        page,
        ...filtersTransformer(filters),
      },
    }
  )
  return data
}

/**
 * @description 取得險種篩選條件
 * @param {string} insurance 險種名
 */
export const fetchInsuranceListFilter = async (
  insurance: string
): Promise<InsuranceListFilterResponse> => {
  const { data } = await request.get(`/api/insurance/${insurance}/tags-filter`)
  return data
}

/**
 * @description 取得無險種頁篩選險種商品價格
 * @param {number[]} productIds
 * @param {FilterValue} premiumConfig
 */
export const updateInsuranceProductFee = async (
  productIds: number[],
  premiumConfig: FilterValue
): Promise<InsuranceProductFeeResponse> => {
  const { data } = await request.get<InsuranceProductFeeResponse>(
    `/api/insurance/product-fee-list`,
    {
      params: {
        product_ids: productIds.join(','),
        ...premiumConfig,
      },
    }
  )

  return data
}

/**
 * @description 取得險種相關文章
 * @param {string} insurance 險種名
 */
export const fetchRelatedBlogs = async (insurance: string): Promise<RelatedBlogsResponse> => {
  const { data } = await request.get<RelatedBlogsResponse>(
    `/api/insurance/${insurance}/related-blogs`
  )
  return data
}

/**
 * @description 取得險種相關問答
 * @param {string} insurance 險種名
 */
export const fetchRelatedQuestions = async (
  insurance: string
): Promise<RelatedQuestionsResponse> => {
  const { data } = await request.get<RelatedQuestionsResponse>(
    `/api/insurance/${insurance}/related-questions`
  )
  return data
}

/**
 * @description 取得主題標籤頁商品
 * @param {FetchInsuranceListPayload} payload
 */
export const fetchInsuranceTagList = async (
  payload: FetchInsuranceListPayload
): Promise<InsuranceListResponse> => {
  const { insurance, page, filters } = payload

  const { data } = await request.get<InsuranceListResponse>(
    decorateSeoQueryString(`/api/insurance/tags/${insurance}/products`),
    {
      params: {
        page,
        ...filtersTransformer(filters),
      },
    }
  )
  return data
}

/**
 * @description 取得主題標籤頁篩選條件
 * @param {string} insurance 主題標籤名
 */
export const fetchInsuranceTagListFilter = async (
  insurance: string
): Promise<InsuranceListFilterResponse> => {
  const { data } = await request.get(`/api/insurance/tags/${insurance}/tags-filter`)
  return data
}

/**
 * @description 取得商品搜尋頁商品
 * @param {FetchInsuranceSearchListPayload} payload
 */
export const fetchInsuranceSearchList = async (
  payload: FetchInsuranceSearchListPayload
): Promise<InsuranceListResponse> => {
  const { q, page, filters } = payload

  const { data } = await request.get<InsuranceListResponse>(
    decorateSeoQueryString(`/api/insurance/search`),
    {
      params: {
        q,
        page,
        ...filtersTransformer(filters),
      },
    }
  )
  return data
}

/**
 * @description 取得商品搜尋頁篩選條件
 * @param {string} q 搜尋關鍵字
 */
export const fetchInsuranceSearchListFilter = async (
  q: string
): Promise<InsuranceListFilterResponse> => {
  const { data } = await request.get(`/api/insurance/search/tags-filter`, {
    params: {
      q,
    },
  })
  return data
}

/**
 * @description 取得搜尋關鍵字無資料的內容
 */
export const fetchSearchNoResult = async (): Promise<SearchNoResultResponse> => {
  const { data } = await request.get(`/api/insurance/search-no-result`)

  return data
}

/**
 * @description 取得保險選項資料（類別、案例、類型、標籤）
 * @returns {Promise<InsuranceOptionsResponse>} 包含保險選項的 Promise
 */
export const fetchInsuranceOptions = async (): Promise<InsuranceOptionsResponse> => {
  const { data } = await request.get<InsuranceOptionsResponse>(
    `${process.env.apiProductUrl}/getInsuranceOptions`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Token': 'egfwfedewg4#213sassx',
      },
    }
  )
  return data
}
