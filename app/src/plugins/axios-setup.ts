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
      const tagStyle =
        'background: #7bd6ff; border-radius: 1em; color: #fff; padding: 2px 6px; font-weight: bold;'
      const contentStyle = 'padding: 2px 6px;'
      // eslint-disable-next-line no-console
      console.log(`%cAPI Request:%c${v.url}`, tagStyle, contentStyle)

      return v
    })

    request.initApiUrlLogger = true
  }

  if (process.client) {
    // Client side add Authorization header in order to valid JWT Token
    request.interceptors.request.use((config) => {
      const auth = Auth.getInstance()
      const jwtToken = auth.getToken()

      config.headers.Authorization = `Bearer ${jwtToken}`
      return config
    })

    request.interceptors.response.use(
      (res) => res,
      (err) => {
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
              return Promise.reject(err)
            })
        } else if (status === 401 && error === 'invalid_token') {
          Suspect.setRoleCode()
          auth.logout()
          return Promise.reject(err)
        } else {
          return Promise.reject(err)
        }
      }
    )
  }
}) as NuxtPlugin
