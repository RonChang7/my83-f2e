import { PopularBlogsResponse, PopularQuestionsResponse } from './list.type'
import request from '@/api/request'

/**
 * @description 取得熱門問答
 */
export const fetchPopularQuestions = async (): Promise<PopularQuestionsResponse> => {
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
