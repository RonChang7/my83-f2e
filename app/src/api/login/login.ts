import {
  FacebookLoginResponse,
  EmailLoginResponse,
  LogoutResponse,
  ForgetPasswordResponse,
} from './login.type'
import request from '@/api/request'
import { UrlInfo } from '@/services/user/user'

/**
 * @description Facebook 註冊 / 登入
 * @param fbToken Facebook token
 * @param role 'sales' | 'client'
 * @param firstHttpReferrer url
 * @param firstUrl url
 */
export const facebookLogin = async ({
  fbToken,
  role,
  firstHttpReferrer,
  firstUrl,
}: FacebookLoginPayload): Promise<FacebookLoginResponse> => {
  const { data, status } = await request.post<FacebookLoginResponse>(
    '/api/auth/facebook-login',
    {
      fb_token: fbToken,
      role,
      first_http_referer: firstHttpReferrer,
      first_url: firstUrl,
    }
  )

  return {
    status,
    ...data,
  }
}

/**
 * @description email 登入
 * @param email email
 * @param password password
 * @param firstHttpReferrer url
 * @param firstUrl url
 */
export const emailLogin = async ({
  email,
  password,
  firstHttpReferrer,
  firstUrl,
}: EmailLoginPayload): Promise<EmailLoginResponse> => {
  const { data, status } = await request.post<EmailLoginResponse>(
    '/api/auth/email-login',
    {
      email,
      password,
      first_http_referer: firstHttpReferrer,
      first_url: firstUrl,
    }
  )

  return {
    status,
    ...data,
  }
}

export const forgetPassword = async (
  email: string,
  redirectUri: string
): Promise<ForgetPasswordResponse> => {
  const { data } = await request.post<ForgetPasswordResponse>(
    '/api/auth/forget-password',
    {
      email,
      redirect_uri: redirectUri,
    }
  )

  return data
}

export const logout = async (): Promise<boolean> => {
  const { data } = await request.get<LogoutResponse>('/api/auth/logout')
  return data.success
}

export interface FacebookLoginPayload extends UrlInfo {
  fbToken: string
  role?: 'sales' | 'client' | undefined
}

export interface EmailLoginPayload extends UrlInfo {
  email: string
  password: string
}

export const login = {
  facebookLogin,
  emailLogin,
}
