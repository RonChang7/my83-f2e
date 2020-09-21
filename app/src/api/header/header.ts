import request from '../request'
import {
  HeaderNavItem,
  HeaderPersonalized,
  HeaderDataResponse,
} from './header.type'

/**
 * @description 取得 Header 選單資料
 */
export const fetchHeaderData = async (): Promise<HeaderNavItem[]> => {
  const { data } = await request.get<HeaderDataResponse>('/api/menu')
  return data.header
}

/**
 * @description 取得個人化 Header 選單資料
 */
export const fetchPersonalizedHeaderData = async (): Promise<
  HeaderPersonalized
> => {
  const { data } = await request.get<HeaderPersonalized>(
    '/api/menu/personalize'
  )
  return data
}
