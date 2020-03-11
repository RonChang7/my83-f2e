import https from 'https'
import axios from 'axios'
import { Auth } from './auth'
import { LoginResponse } from '@/api/login/login.type'

const request = axios.create({
  baseURL: process.env.NUXT_ENV_API_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.client,
  }),
  withCredentials: true,
})

request.interceptors.request.use((config) => {
  const jwtToken = Auth.getToken()

  config.headers.Authorization = `Bearer ${jwtToken}`
  return config
})

const refreshJWTToken = async (): Promise<LoginResponse> => {
  const { data, status } = await request.get<LoginResponse>('/api/auth/refresh')

  return {
    status,
    ...data,
  }
}

export class JWT {
  public static isRefreshing: Promise<void> | null

  public static refreshToken = () => {
    if (JWT.isRefreshing) {
      return JWT.isRefreshing
    }

    if (Auth.expiredTime && Date.now() < Auth.expiredTime * 1000) {
      JWT.isRefreshing = new Promise((resolve) => {
        setTimeout(() => {
          JWT.isRefreshing = null
          resolve()
        })
      })
    } else {
      JWT.isRefreshing = new Promise((resolve, reject) => {
        refreshJWTToken()
          .then(({ token, expired_time }) => {
            Auth.refresh({
              jwtToken: token!,
              expiredTime: expired_time!,
            })
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            JWT.isRefreshing = null
          })
      })
    }

    return JWT.isRefreshing
  }
}
