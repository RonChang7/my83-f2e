import {
  InsurancePageStaticData,
  FetchInsurancePageStaticDataPayload,
  RelatedBlogsResponse,
  RelatedQuestionsResponse,
} from './insurance.type'
import request from '@/api/request'

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
      fs.readFileSync(
        `src/static/static/insurance-page/${insurance}.json`,
        'utf8'
      )
    )
    return data
  }

  const { data } = await request.get(
    `${host}/static/insurance-page/${insurance}.json`
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
