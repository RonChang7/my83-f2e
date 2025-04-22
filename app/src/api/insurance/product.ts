import request from '@/api/request'
import { decorateSeoQueryString } from '@/api/decorate-seo-to-api'
import {
  ProductResponse,
  ProductFeeResponse,
  FetchProductFeePayload,
  ProductReportRequest,
  SingleProductResponse,
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

/**
 * @description 取得單一產品詳細資訊
 * @param {string} productName 產品名稱
 */
export const fetchSingleProduct = async (
  productName: string
): Promise<SingleProductResponse> => {
  const { data } = await request.post<SingleProductResponse>(
    `${process.env.apiProductUrl}/sb-api/single_product_intro/${productName}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Token': 'egfwfedewg4#213sassx',
      },
    }
  )
  return data
}
