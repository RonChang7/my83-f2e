import Cookies, { CookieAttributes } from 'js-cookie'
import { jwtParser, Response } from '@/utils/jwt-parser'

const jwtTokenKey: string = process.env.NUXT_ENV_JWT_TOKEN_NAME!

export class Auth {
  private static cookieAttributes: CookieAttributes = {
    path: '/',
    secure: true,
  }

  public static login(payload: payload) {
    Auth.setToken(payload)
  }

  public static logout() {
    Auth.removeToken()
  }

  public static refresh(payload: payload) {
    Auth.setToken(payload)
  }

  public static getToken() {
    return Cookies.get(jwtTokenKey)
  }

  public static get expiredTime() {
    const result = jwtParser(Auth.getToken())
    if (result.success) {
      return (result as Response<true>).exp
    }
    return null
  }

  private static setToken({ jwtToken, expiredTime }: payload) {
    Cookies.set(jwtTokenKey, jwtToken, {
      expires: new Date(expiredTime * 1000),
      ...Auth.cookieAttributes,
    })
  }

  private static removeToken() {
    Cookies.remove(jwtTokenKey, Auth.cookieAttributes)
  }
}

interface payload {
  jwtToken: string
  expiredTime: number
}
