import {
  ProductResponse,
  ProductFeeResponse,
  FetchProductFeePayload,
} from './product.type'
import request from '@/api/request'
import { decorateSeoQueryString } from '@/api/decorate-seo-to-api'

export const fetchProduct = async (id: string): Promise<ProductResponse> => {
  const { data } = await request.get(
    decorateSeoQueryString(`/api/insurance/product/${id}`)
  )

  return data
}

export const fetchProductFee = async (
  payload: FetchProductFeePayload
): Promise<ProductFeeResponse> => {
  const { productId, gender, age, jobLevel, amount, plan, amountUnit } = payload

  const { data } = await request.post('/api/insurance/query-premium', {
    product_id: productId,
    gender,
    age,
    job_level: jobLevel,
    amount,
    plan_id: plan,
    amount_unit: amountUnit,
  })

  return data
}
