import { QuestionDataResponse } from './question.type'
import request from '@/api/request'

export const fetchQuestionData = async (
  id: number
): Promise<QuestionDataResponse> => {
  const { data } = await request.get<QuestionDataResponse>(
    `/api/v1/question/${id}`
  )
  return data
}
