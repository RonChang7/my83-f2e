import {
  FacebookSignUpResponse,
  FacebookLoginResponse,
  EmailLoginResponse,
  LogoutResponse,
  ForgetPasswordResponse,
  FacebookSignUpPayload,
  FacebookLoginPayload,
  EmailLoginPayload,
} from './login.type'
import request from '@/api/request'

/**
 * @description Facebook 註冊
 * @param {FacebookSignUpPayload} payload
 */
export const facebookSignUp = async ({
  fbToken,
  role,
  firstHttpReferrer,
  firstUrl,
  roleSession,
}: FacebookSignUpPayload): Promise<FacebookSignUpResponse> => {
  const { data, status } = await request.post<FacebookSignUpResponse>(
    '/api/auth/facebook-signup',
    {
      fb_token: fbToken,
      role,
      first_http_referer: firstHttpReferrer,
      first_url: firstUrl,
      role_session: roleSession,
    }
  )

  return {
    status,
    ...data,
  }
}

/**
 * @description Facebook 登入
 * @param {FacebookLoginPayload} payload
 */
export const facebookLogin = async ({
  fbToken,
  firstHttpReferrer,
  firstUrl,
  roleSession,
}: FacebookLoginPayload): Promise<FacebookLoginResponse> => {
  const { data, status } = await request.post<FacebookLoginResponse>(
    '/api/auth/facebook-login',
    {
      fb_token: fbToken,
      first_http_referer: firstHttpReferrer,
      first_url: firstUrl,
      role_session: roleSession,
    }
  )

  return {
    status,
    ...data,
  }
}

/**
 * @description email 登入
 * @param {EmailLoginPayload} payload
 */
export const emailLogin = async ({
  email,
  password,
  firstHttpReferrer,
  firstUrl,
  roleSession,
}: EmailLoginPayload): Promise<EmailLoginResponse> => {
  const { data, status } = await request.post<EmailLoginResponse>(
    '/api/auth/email-login',
    {
      email,
      password,
      first_http_referer: firstHttpReferrer,
      first_url: firstUrl,
      role_session: roleSession,
    }
  )

  return {
    status,
    ...data,
  }
}

/**
 * @description 忘記密碼
 * @param {string} email email
 * @param {string} redirectUri 送出後轉址頁面網址
 */
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

/**
 * @description 登出
 */
export const logout = async (): Promise<boolean> => {
  const { data } = await request.get<LogoutResponse>('/api/auth/logout')
  return data.success
}

export const login = {
  facebookSignUp,
  facebookLogin,
  emailLogin,
}
