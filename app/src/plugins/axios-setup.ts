import { Plugin as NuxtPlugin } from '@nuxt/types'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import request, { Request } from '@/api/request'
import { sentryLog } from '@/api/sentry'
import {
  checkRedirectResponse,
  RedirectErrorResponseBody,
} from '@/api/errors/response'
import { OnRedirectingException } from '@/api/errors/OnRedirectingException'

export default (({ app, req }) => {
  const preventInterceptorsList = ['/api/auth/logout']
  const {
    APP_ENV,
    CLIENT_API_URL,
    SERVER_API_URL,
    SERVER_API_HOST,
    API_SERVER_BASIC_AUTH_BASE64,
  } = app.$env
  const requestInstance = Request.getInstance()
  const API_URL = process.server ? SERVER_API_URL : CLIENT_API_URL

  request.defaults.baseURL = API_URL

  if (APP_ENV === 'development' && !requestInstance.initApiUrlLogger) {
    request.interceptors.request.use((v) => {
      // eslint-disable-next-line no-console
      console.log(`\x1B[34mAPI Request:\x1B[0m`, v.url)

      return v
    })

    requestInstance.initApiUrlLogger = true
  }

  // Add basic auth header for dev server
  if (API_SERVER_BASIC_AUTH_BASE64) {
    request.defaults.headers.Authorization = `Basic ${API_SERVER_BASIC_AUTH_BASE64}`
  }

  if (process.server) {
    // 添加日誌輸出，診斷任何環境中的問題
    console.log('\x1B[33mSSR API Setup:\x1B[0m', {
      APP_ENV,
      SERVER_API_URL,
      SERVER_API_HOST,
      originalHost: req?.headers?.host,
      originalReferer: req?.headers?.referer,
    })

    // 先保存原始 request headers
    request.defaults.headers.common =
      req && req.headers ? Object.assign({}, req.headers) : {}

    // 特別處理 Host 請求頭，記錄修改前後的值
    const originalHost = request.defaults.headers.common.host

    // 核心修改：條件性設置 host
    // 如果是搜尋相關請求，可能需要保留原始 host
    const preserveOriginalHost =
      req?.headers?.referer &&
      (req.headers.referer.includes('insurance/search') ||
        req.url?.includes('insurance/search'))

    if (!preserveOriginalHost) {
      request.defaults.headers.common.host = SERVER_API_HOST
    } else {
      // 對搜尋相關請求，保留原始 host
      console.log('\x1B[32mPreserving original host for search request\x1B[0m')
    }

    // 記錄主機頭的變更
    console.log('\x1B[33mHost Header Changed:\x1B[0m', {
      originalHost,
      newHost: request.defaults.headers.common.host,
      preserveOriginalHost,
      referer: request.defaults.headers.common.referer,
      url: req?.url,
    })

    // Don't accept brotli encoding because Node can't parse it
    request.defaults.headers.common['accept-encoding'] = 'gzip, deflate'

    if (!requestInstance.initServerSideSentryInterceptor) {
      request.interceptors.response.use(
        (res) => {
          return res
        },
        (err) => {
          if (err.response) {
            // 在所有環境中記錄 API 錯誤詳情
            console.error('\x1B[31mSSR API Error:\x1B[0m', {
              APP_ENV,
              status: err?.response?.status,
              url: err.config.url,
              data: err?.response?.data,
            })

            if (checkRedirectResponse(err.response)) {
              const res: AxiosResponse<RedirectErrorResponseBody> = err.response
              return Promise.reject(
                new OnRedirectingException(res.data.data.link.path)
              )
            }
          }

          sentryLog(app.$sentry, err, {
            statusCode: err?.response?.status || '',
            method: err.config.method,
            apiUrl: err.config.url,
            message: 'API error',
          })

          return Promise.reject(err)
        }
      )

      requestInstance.initServerSideSentryInterceptor = true
    }
  }

  if (process.client) {
    // Client side add Authorization header in order to valid JWT Token
    request.interceptors.request.use((config) => {
      const jwtToken = app.$auth.getToken()

      if (jwtToken) {
        config.headers['X-Auth'] = `Bearer ${jwtToken}`
      }
      return config
    })

    /**
     * Axios error handler
     * https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
     */
    request.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response) {
          const {
            config,
            response: {
              status,
              data: { error },
            },
          } = err

          const originalRequest = config as AxiosRequestConfig

          if (
            preventInterceptorsList.find(
              (url) => API_URL + url === originalRequest.url
            )
          ) {
            return Promise.reject(err)
          } else if (status === 401 && error === 'expired_token') {
            return app.$auth
              .refreshToken(API_URL, API_SERVER_BASIC_AUTH_BASE64)
              .then(() => {
                const jwtToken = app.$auth.getToken()
                originalRequest.headers['X-Auth'] = `Bearer ${jwtToken}`
                return request(originalRequest)
              })
              .catch((err) => {
                const refreshTokenStatus = err?.response?.status
                const refreshTokenError = err?.response?.data?.error

                // refresh token 失敗，則刪除 cookies 所存的 token
                if (
                  refreshTokenStatus === 401 &&
                  refreshTokenError === 'invalid_token'
                ) {
                  app.$auth.logout()
                }
                return Promise.reject(err)
              })
          } else if (status === 401 && error === 'invalid_token') {
            app.$auth.logout()
            return Promise.reject(err)
          } else if (
            status === 302 &&
            err.response?.data?.status === 'FORCE-REDIRECT'
          ) {
            window.location.href =
              err.response.data.redirectTo +
              '?returnUrl=' +
              window.location.href
          } else {
            if (checkRedirectResponse(err.response)) {
              const res: AxiosResponse<RedirectErrorResponseBody> = err.response
              return Promise.reject(
                new OnRedirectingException(res.data.data.link.path)
              )
            }

            sentryLog(app.$sentry, err, {
              statusCode: err?.response?.status || '',
              method: err.config.method,
              apiUrl: err.config.url,
              message: 'API error',
            })
            return Promise.reject(err)
          }
        } else {
          sentryLog(app.$sentry, err, {
            statusCode: err?.response?.status || '',
            method: err.config.method,
            apiUrl: err.config.url,
            message: 'API error',
          })

          err = {
            ...err,
            response: {
              status: 0,
              data: {
                success: false,
                message: '發生問題，請稍後再試',
                error_message: '發生問題，請稍後再試',
              },
            },
          }
          return Promise.reject(err)
        }
      }
    )
  }
}) as NuxtPlugin
