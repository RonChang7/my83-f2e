import {
  PopularBlogsResponse,
  PopularQuestionsResponse,
  QuestionListResponse,
  FetchQuestionListPayload,
} from './list.type'
import request from '@/api/request'

/**
 * @description Question 列表
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
