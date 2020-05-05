import { AskingFormOptionResponse } from './asking.type'
import request from '@/api/request'

export const fetchAskingFormOption = async (): Promise<AskingFormOptionResponse> => {
  const { data } = await request.get(`/api/v1/question/tags`)
  return data
}
