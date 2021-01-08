import https from 'https'
import axios from 'axios'
import { LoginResponse } from '@/api/login/login.type'

const request = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.client,
  }),
  withCredentials: true,
})

const refreshJWTToken = async (
  baseURL: string,
  basicAuth: string,
  previousJWTToken: string
): Promise<LoginResponse> => {
  request.defaults.baseURL = baseURL
  request.defaults.headers['X-Auth'] = `Bearer ${previousJWTToken}`
  if (basicAuth) {
    request.defaults.headers.Authorization = `Basic ${basicAuth}`
  }

  const { data, status } = await request.get<LoginResponse>('/api/auth/refresh')

  return {
    status,
    ...data,
  }
}

export class JWT {
  public static isRefreshing: Promise<JWTRefreshResponsePayload> | null

  public static refreshToken = (
    baseURL: string,
    basicAuth: string,
    payload: JWTPayload
  ) => {
    if (JWT.isRefreshing) {
      return JWT.isRefreshing
    }

    if (payload.expiredTime && Date.now() < payload.expiredTime * 1000) {
      JWT.isRefreshing = new Promise((resolve) => {
        setTimeout(() => {
          JWT.isRefreshing = null
          resolve()
        })
      })
    } else {
      JWT.isRefreshing = new Promise((resolve, reject) => {
        refreshJWTToken(baseURL, basicAuth, payload.jwtToken)
          .then(({ token, expired_time }) => {
            resolve({ jwtToken: token!, expiredTime: expired_time! })
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

interface JWTPayload {
  jwtToken: string
  expiredTime: number
}

interface JWTRefreshResponsePayload extends JWTPayload {}
