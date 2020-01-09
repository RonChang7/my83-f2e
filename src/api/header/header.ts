// import request from '../request'
import mock from './mock'
import { HeaderNavItem, HeaderPersonalizedData } from './header.type'

/**
 * @description 取得 Header 選單資料
 *
 */
export const fetchHeaderData = async (): Promise<HeaderNavItem[]> => {
  // const { data } = await request.get<HeaderNavItem>(``)

  const data: HeaderNavItem[] = await Promise.resolve(mock.header)

  return data
}

/**
 *
 */
export const fetchPersonalizedHeaderData = async (): Promise<HeaderPersonalizedData> => {
  // const { data } = await request.get<HeaderPersonalizedData>(``)

  const data: HeaderPersonalizedData = await Promise.resolve(
    mock.personalizeHeader
  )

  return data
}
