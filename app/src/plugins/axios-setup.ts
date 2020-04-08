import { Plugin as NuxtPlugin } from '@nuxt/types'
import { AxiosRequestConfig } from 'axios'
import request from '@/api/request'
import { Auth } from '@/services/auth/auth'
import { Suspect } from '@/services/user/suspect'
import { JWT } from '@/services/auth/jwt'

export default (({ app }) => {
  const preventInterceptorsList = ['/api/auth/logout']
  const { APP_ENV, API_URL } = app.$env

  request.defaults.baseURL = API_URL

  if (APP_ENV === 'development' && !request.initApiUrlLogger) {
    request.interceptors.request.use((v) => {
      // eslint-disable-next-line no-console
      console.log(`\x1B[34mAPI Request:\x1B[0m`, v.url)

      return v
    })

    request.initApiUrlLogger = true
  }

  if (process.client) {
    // Client side add Authorization header in order to valid JWT Token
    request.interceptors.request.use((config) => {
      const auth = Auth.getInstance()
      const jwtToken = auth.getToken()

      if (jwtToken) {
        config.headers.Authorization = `Bearer ${jwtToken}`
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
          const auth = Auth.getInstance()

          if (
            preventInterceptorsList.find(
              (url) => API_URL + url === originalRequest.url
            )
          ) {
            return Promise.reject(err)
          } else if (status === 401 && error === 'expired_token') {
            return JWT.refreshToken(API_URL)
              .then(() => {
                const jwtToken = auth.getToken()
                originalRequest.headers.Authorization = `Bearer ${jwtToken}`
                return request(originalRequest)
              })
              .catch((err) => {
                if (status === 401 && error === 'invalid_token') {
                  Suspect.setRoleCode()
                  auth.logout()
                }
                return Promise.reject(err)
              })
          } else if (status === 401 && error === 'invalid_token') {
            Suspect.setRoleCode()
            auth.logout()
            return Promise.reject(err)
          } else {
            return Promise.reject(err)
          }
        } else {
          err = {
            ...err,
            response: {
              status: 0,
              data: {
                success: false,
                message: '發生問題，請稍後再試',
              },
            },
          }
          return Promise.reject(err)
        }
      }
    )
  }
}) as NuxtPlugin
