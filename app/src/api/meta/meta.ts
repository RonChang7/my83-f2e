import request from '../request'
import { ActiveSalesCountResponse } from './meta.type'

export const fetchActiveSalesCount = async (): Promise<
  ActiveSalesCountResponse
> => {
  const { data } = await request.get<ActiveSalesCountResponse>(
    '/api/meta/actived-sales-count'
  )
  return data
}
