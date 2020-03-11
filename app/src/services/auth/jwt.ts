import https from 'https'
import axios from 'axios'
import { Auth } from './auth'
import { LoginResponse } from '@/api/login/login.type'

const request = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.client,
  }),
  withCredentials: true,
})

request.interceptors.request.use((config) => {
  const auth = Auth.getInstance()
  const jwtToken = auth.getToken()

  config.headers.Authorization = `Bearer ${jwtToken}`
  return config
})

const refreshJWTToken = async (baseURL: string): Promise<LoginResponse> => {
  request.defaults.baseURL = baseURL

  const { data, status } = await request.get<LoginResponse>('/api/auth/refresh')

  return {
    status,
    ...data,
  }
}

export class JWT {
  public static isRefreshing: Promise<void> | null

  public static refreshToken = (baseURL: string) => {
    const auth = Auth.getInstance()

    if (JWT.isRefreshing) {
      return JWT.isRefreshing
    }

    if (auth.expiredTime && Date.now() < auth.expiredTime * 1000) {
      JWT.isRefreshing = new Promise((resolve) => {
        setTimeout(() => {
          JWT.isRefreshing = null
          resolve()
        })
      })
    } else {
      JWT.isRefreshing = new Promise((resolve, reject) => {
        refreshJWTToken(baseURL)
          .then(({ token, expired_time }) => {
            auth.refresh({
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
