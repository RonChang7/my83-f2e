import request from '@/api/request'
import { ProductReportRequest, SingleProductResponse } from './product.type'

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
