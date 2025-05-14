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
  productName: any
): Promise<SingleProductResponse> => {
  // 處理SSR階段的特殊情況 - 確保即使在服務器端也能正確處理參數
  let sanitizedProductName: string

  // 檢查是否是物件
  if (typeof productName === 'object' && productName !== null) {
    if ('productName' in productName) {
      sanitizedProductName = String(productName.productName)
    } else if (
      Object.prototype.toString.call(productName) === '[object Object]'
    ) {
      console.error('接收到未格式化的物件作為參數，會導致URL錯誤')
      // 使用一個安全的預設值或拋出錯誤，避免進一步請求
      throw new Error('參數格式錯誤: 產品名稱不能是未序列化的物件')
    } else {
      // 嘗試其他方法序列化
      sanitizedProductName = JSON.stringify(productName)
    }
  } else {
    sanitizedProductName = String(productName)
  }

  // 設置基礎URL
  const baseUrl = process.env.apiProductUrl
  const url = `${baseUrl}/sb-api/single_product_intro/${encodeURIComponent(
    sanitizedProductName
  )}`

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
