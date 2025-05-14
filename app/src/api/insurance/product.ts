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
  // 處理SSR階段的特殊情況 - 確保即使在服務器端也能正確處理參數
  const url = `${
    process.env.apiProductUrl
  }/sb-api/single_product_intro/${encodeURIComponent(productName)}`

  const { data } = await request.post<SingleProductResponse>(
    url,
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
