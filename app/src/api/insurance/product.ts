import { ProductResponse } from './product.type'
import request from '@/api/request'
import { decorateSeoQueryString } from '@/api/decorate-seo-to-api'

export const fetchProduct = async (id: string): Promise<ProductResponse> => {
  const { data } = await request.get(
    decorateSeoQueryString(`/api/insurance/product/${id}`)
  )

  return data
}
