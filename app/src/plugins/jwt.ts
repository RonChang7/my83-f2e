import { Plugin as NuxtPlugin } from '@nuxt/types'
import { AxiosRequestConfig } from 'axios'
import request from '@/api/request'
import { Auth } from '@/services/auth/auth'
import { Suspect } from '@/services/user/suspect'
import { JWT } from '@/services/auth/jwt'

const preventInterceptorsList = ['/api/auth/logout']
const baseURL = process.env.NUXT_ENV_API_URL

export default (() => {
  if (process.client) {
    // Client side add Authorization header in order to valid JWT Token
    request.interceptors.request.use((config) => {
      const jwtToken = Auth.getToken()

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
        if (
          preventInterceptorsList.find(
            (url) => baseURL + url === originalRequest.url
          )
        ) {
          return Promise.reject(err)
        } else if (status === 401 && error === 'expired_token') {
          return JWT.refreshToken()
            .then(() => {
              const jwtToken = Auth.getToken()
              originalRequest.headers.Authorization = `Bearer ${jwtToken}`
              return request(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        } else if (status === 401 && error === 'invalid_token') {
          Suspect.setRoleCode()
          Auth.logout()
          return Promise.reject(err)
        } else {
          return Promise.reject(err)
        }
      }
    )
  }
}) as NuxtPlugin
