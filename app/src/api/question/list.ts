import request from '@/api/request'
import {
  PopularBlogsResponse,
  PopularQuestionsResponse,
  QuestionListResponse,
  QuestionSearchResponse,
  FetchQuestionListPayload,
  FetchSearchQuestionListPayload,
  PromotionsResponse,
} from './list.type'

/**
 * @description Question 列表
 * @param {FetchQuestionListPayload} payload
 */
export const fetchQuestionList = async ({
  page,
  sort,
}: FetchQuestionListPayload): Promise<QuestionListResponse> => {
  const { data } = await request.get<QuestionListResponse>(
    `/api/v1/questions`,
    {
      params: {
        page,
        sort,
      },
    }
  )
  return data
}

/**
 * @description Question 搜尋
 * @param {FetchSearchQuestionListPayload} payload
 */
export const fetchSearchQuestionList = async ({
  page,
  sort,
  q,
}: FetchSearchQuestionListPayload): Promise<QuestionSearchResponse> => {
  const { data } = await request.get<QuestionSearchResponse>(
    `/api/v1/questions/search`,
    {
      params: {
        page,
        sort,
        q,
      },
    }
  )
  return data
}

/**
 * @description 取得熱門問答
 */
export const fetchPopularQuestions = async (): Promise<
  PopularQuestionsResponse
> => {
  const { data } = await request.get<PopularQuestionsResponse>(
    `/api/v1/questions/hot-qa`
  )
  return data
}

/**
 * @description 取得熱門文章
 */
export const fetchPopularBlogs = async (): Promise<PopularBlogsResponse> => {
  const { data } = await request.get<PopularBlogsResponse>(
    `/api/v1/questions/hot-blog`
  )
  return data
}

/**
 * @description 取得推薦商品
 */
export const fetchPromotions = async (): Promise<PromotionsResponse> => {
  const { data } = await request.get<PromotionsResponse>(
    `/api/v1/questions/promotion`
  )
  return data
}
