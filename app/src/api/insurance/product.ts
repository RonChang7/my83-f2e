import request from '@/api/request'
import { decorateSeoQueryString } from '@/api/decorate-seo-to-api'
import {
  ProductResponse,
  ProductFeeResponse,
  FetchProductFeePayload,
  ProductReportRequest,
} from './product.type'

export const fetchProduct = async (id: string): Promise<ProductResponse> => {
  const { data } = await request.get(
    decorateSeoQueryString(`/api/insurance/product/${id}`)
  )

  return data
}

export const fetchProductFee = async ({
  productId,
  gender,
  age,
  job_level,
  amount,
  plan_id,
  amountUnit,
}: FetchProductFeePayload): Promise<ProductFeeResponse> => {
  const { data } = await request.post('/api/insurance/query-premium', {
    product_id: productId,
    gender,
    age,
    job_level,
    amount,
    plan_id,
    amount_unit: amountUnit,
  })

  return data
}

export const productReport = async ({
  id,
  content,
  refLink,
  reporter,
  reporterContact,
}: ProductReportRequest) => {
  const { data } = await request.post(`/api/insurance/product/${id}/report`, {
    content,
    ref_link: refLink,
    reporter,
    reporter_contact: reporterContact,
  })

  return data
}
