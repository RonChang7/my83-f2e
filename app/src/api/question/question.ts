import { SimpleResponse } from '../type'
import {
  QuestionDataResponse,
  AnswerDataResponse,
  QuestionPersonalizeResponse,
  AnswerPersonalizeResponse,
  FollowQuestionResponse,
  UnFollowQuestionResponse,
  SetBestAnswerResponse,
  UnsetBestAnswerResponse,
  AddAnswerPayload,
  AddAnswerResponse,
  AddResponsePayload,
  AddResponseResponse,
  UpdateLikeStatuePayload,
  UpdateLikeStatueResponse,
  RelatedBlogsResponse,
  RelatedQuestionsResponse,
  addReportPayload,
  cancelReportPayload,
} from './question.type'
import request from '@/api/request'

/**
 * @description 取得單則 Question 內容
 * @param {number} id Question id
 */
export const fetchQuestionData = async (
  id: number
): Promise<QuestionDataResponse> => {
  const { data } = await request.get<QuestionDataResponse>(
    `/api/v1/question/${id}`
  )
  return data
}

/**
 * @description 取得單則 Question 之 Answer 內容
 * @param {number} id Question id
 */
export const fetchAnswerData = async (
  id: number
): Promise<AnswerDataResponse> => {
  const { data } = await request.get<AnswerDataResponse>(
    `/api/v1/question/${id}/answers`
  )
  return data
}

/**
 * @description 取得單則 Question 個人化資料
 * @param {number} id Question id
 */
export const fetchQuestionPersonalizeData = async (
  id: number
): Promise<QuestionPersonalizeResponse> => {
  const { data } = await request.get<QuestionPersonalizeResponse>(
    `/api/v1/question/${id}/personalize`
  )
  return data
}

/**
 * @description 取得單則 Question 之 Answer 個人化資料
 * @param {number} id Question id
 */
export const fetchAnswerPersonalizeData = async (
  id: number
): Promise<AnswerPersonalizeResponse[]> => {
  const { data } = await request.get<AnswerPersonalizeResponse[]>(
    `/api/v1/question/${id}/answers/personalize`
  )
  return data
}

/**
 * @description 追蹤 Question
 * @param {number} id Question id
 */
export const followQuestion = async (
  id: number
): Promise<FollowQuestionResponse> => {
  const { data } = await request.get<FollowQuestionResponse>(
    `/api/v1/question/${id}/follow`
  )
  return data
}

/**
 * @description 取消追蹤 Question
 * @param {number} id Question id
 */
export const unFollowQuestion = async (
  id: number
): Promise<UnFollowQuestionResponse> => {
  const { data } = await request.get<UnFollowQuestionResponse>(
    `/api/v1/question/${id}/unfollow`
  )
  return data
}

/**
 * @description 設定最佳解答
 * @param {number} questionId Question id
 * @param {number} answerId Answer id
 */
export const setBestAnswer = async (
  questionId: number,
  answerId: number
): Promise<SetBestAnswerResponse> => {
  const { data } = await request.post<SetBestAnswerResponse>(
    `/api/v1/question/${questionId}/best-answer/${answerId}`
  )
  return data
}

/**
 * @description 取消最佳解答
 * @param {number} id Question id
 */
export const unsetBestAnswer = async (
  id: number
): Promise<UnsetBestAnswerResponse> => {
  const { data } = await request.post<UnsetBestAnswerResponse>(
    `/api/v1/question/${id}/unset-best-answer`
  )
  return data
}

/**
 * @description 新增 Answer
 * @param {AddAnswerPayload} payload
 */
export const addAnswer = async ({
  questionId,
  nickname,
  content,
}: AddAnswerPayload): Promise<AddAnswerResponse> => {
  const { data } = await request.post<AddAnswerResponse>(
    `/api/v1/question/${questionId}/create-answer`,
    {
      nickname,
      content,
    }
  )
  return data
}

/**
 * @description 新增 Response
 * @param {AddResponsePayload} payload
 */
export const addResponse = async ({
  questionId,
  answerId,
  nickname,
  content,
}: AddResponsePayload): Promise<AddResponseResponse> => {
  const { data } = await request.post<AddResponseResponse>(
    `/api/v1/question/${questionId}/answer/${answerId}/create-response`,
    {
      nickname,
      content,
    }
  )
  return data
}

/**
 * @description 更新 Answer like status
 * @param {UpdateLikeStatuePayload} payload
 */
export const likeAnswer = async ({
  questionId,
  answerId,
  likeStatus,
}: UpdateLikeStatuePayload): Promise<UpdateLikeStatueResponse> => {
  const { data } = await request.get<UpdateLikeStatueResponse>(
    `/api/v1/question/${questionId}/answer/${answerId}/like/${likeStatus}`
  )
  return data
}

/**
 * @description 取得 Question 相關問答
 * @param {number} id Question id
 */
export const fetchRelatedQuestions = async (
  id: number
): Promise<RelatedQuestionsResponse> => {
  const { data } = await request.get<RelatedQuestionsResponse>(
    `/api/v1/question/${id}/related-questions`
  )
  return data
}

/**
 * @description 取得 Question 相關文章
 * @param {number} id Question id
 */
export const fetchRelatedBlogs = async (
  id: number
): Promise<RelatedBlogsResponse> => {
  const { data } = await request.get<RelatedBlogsResponse>(
    `/api/v1/question/${id}/related-blogs`
  )
  return data
}

/**
 * @description 檢舉 Question
 * @param {addReportPayload} payload
 */
export const addQuestionReport = async ({
  questionId,
  comment,
}: addReportPayload): Promise<SimpleResponse> => {
  const { data } = await request.post<SimpleResponse>(
    `/api/v1/question/${questionId}/report`,
    {
      comment,
    }
  )
  return data
}

/**
 * @description 取消檢舉 Question
 * @param {cancelReportPayload} payload
 */
export const cancelQuestionReport = async ({
  questionId,
}: cancelReportPayload): Promise<SimpleResponse> => {
  const { data } = await request.post<SimpleResponse>(
    `/api/v1/question/${questionId}/cancel-report`
  )
  return data
}

/**
 * @description 檢舉 Answer
 * @param {addReportPayload} payload
 */
export const addAnswerReport = async ({
  questionId,
  answerId,
  comment,
}: addReportPayload): Promise<SimpleResponse> => {
  const { data } = await request.post<SimpleResponse>(
    `/api/v1/question/${questionId}/answer/${answerId}/report`,
    {
      comment,
    }
  )
  return data
}

/**
 * @description 取消檢舉 Answer
 * @param {cancelReportPayload} payload
 */
export const cancelAnswerReport = async ({
  questionId,
  answerId,
}: cancelReportPayload): Promise<SimpleResponse> => {
  const { data } = await request.post<SimpleResponse>(
    `/api/v1/question/${questionId}/answer/${answerId}/cancel-report`
  )
  return data
}
