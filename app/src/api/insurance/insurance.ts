import {
  InsurancePageStaticData,
  FetchInsurancePageStaticDataPayload,
  RelatedBlogsResponse,
  RelatedQuestionsResponse,
  PromotionInsuranceProductResponse,
  InsuranceListResponse,
  FetchInsuranceListPayload,
} from './insurance.type'
import request from '@/api/request'
import { decorateSeoQueryString } from '@/api/decorate-seo-to-api'

/**
 * @description 取得險種頁靜態資料
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

  const { data } = await request.get(
    `${host}/static/insurance/${insurance}.json`
  )
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
 * @param {InsuranceListPayload} payload
 */
export const fetchInsuranceList = async (
  payload: FetchInsuranceListPayload
): Promise<InsuranceListResponse> => {
  const { insurance, page } = payload

  const { data } = await request.get<InsuranceListResponse>(
    decorateSeoQueryString(`/api/insurance/${insurance}/products`),
    {
      params: {
        page,
      },
    }
  )
  return data
}

/**
 * @description 取得險種相關文章
 * @param {string} insurance 險種名
 */
export const fetchRelatedBlogs = async (
  insurance: string
): Promise<RelatedBlogsResponse> => {
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
