import {
  AskingFormOptionResponse,
  CreateQuestionResponse,
  EditQuestionResponse,
  SubmitQuestionPayload,
  SubmitQuestionResponse,
} from './asking.type'
import request from '@/api/request'

/**
 * @description 取得發文分類選項
 */
export const fetchAskingFormOption = async (): Promise<AskingFormOptionResponse> => {
  const { data } = await request.get(`/api/v1/question/tags`)
  return data
}

/**
 * @description 檢查使用者發文 (新問題) 資格
 */
export const createQuestion = async (): Promise<CreateQuestionResponse> => {
  const { data } = await request.get(`api/v1/question/create`)
  return data
}

/**
 * @description 取得使用者發文 (編輯問題) 文章內容與資格
 * @param {number} id Question id
 */
export const editQuestion = async (
  id: number
): Promise<EditQuestionResponse> => {
  const { data } = await request.get(`api/v1/question/${id}/edit`)
  return data
}

/**
 * @description 新增問題
 * @param {SubmitQuestionPayload} payload
 */
export const submitNewQuestion = async (
  payload: SubmitQuestionPayload
): Promise<SubmitQuestionResponse> => {
  const { data } = await request.post(`api/v1/question/create`, payload)
  return data
}

/**
 * @description 編輯問題
 * @param {number} id Question id
 * @param {SubmitQuestionPayload} payload
 */
export const submitEditQuestion = async (
  id: number,
  payload: SubmitQuestionPayload
): Promise<SubmitQuestionResponse> => {
  const { data } = await request.post(`api/v1/question/${id}/save`, payload)
  return data
}
