// src/server/middleware/api-proxy.ts
import { ServerMiddleware } from '@nuxt/types'
import axios from 'axios'

const apiProxy: ServerMiddleware = async (req, res, next) => {
  // 只處理特定路徑
  if (!req.url?.startsWith('/api-product/')) {
    return next()
  }

  try {
    // 取得目標 URL
    const baseUrl =
      process.env.NODE_ENV !== 'production'
        ? 'https://productot.smartbeb.com.tw'
        : 'https://product.smartbeb.com.tw'

    const targetPath = req.url.replace('/api-product/', '/3i-api/')
    const targetUrl = `${baseUrl}${targetPath}`

    // 取得請求方法與數據
    const method = req.method?.toLowerCase() || 'get'
    let requestData = {}

    // 如果是 POST/PUT 等請求，取得請求體
    if (['post', 'put', 'patch'].includes(method)) {
      requestData = await new Promise((resolve) => {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk.toString()
        })
        req.on('end', () => {
          try {
            resolve(JSON.parse(body))
          } catch {
            resolve({})
          }
        })
      })
    }

    // 轉發請求
    const response = await axios({
      method: method as any,
      url: targetUrl,
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'X-Token': 'egfwfedewg4#213sassx',
      },
    })

    // 設定響應標頭
    res.setHeader('Content-Type', 'application/json')

    // 回傳響應
    res.end(JSON.stringify(response.data))
  } catch (error: any) {
    console.error('API proxy error:', error.message || error)

    // 設定錯誤狀態碼
    res.statusCode = error.response?.status || 500

    // 回傳錯誤訊息
    res.end(
      JSON.stringify({
        error: error.message || 'Internal Server Error',
      })
    )
  }
}

export default apiProxy
