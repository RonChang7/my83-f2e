import Cookies, { CookieAttributes } from 'js-cookie'
import { jwtParser, Response } from '@/utils/jwt-parser'

export class Auth {
  private static instance: Auth

  private jwtTokenKey: string

  private cookieAttributes: CookieAttributes

  private constructor() {
    this.cookieAttributes = {
      path: '/',
      secure: true,
    }
  }

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth()
    }

    return Auth.instance
  }

  public login(payload: payload) {
    this.setToken(payload)
  }

  public logout() {
    this.removeToken()
  }

  public refresh(payload: payload) {
    this.setToken(payload)
  }

  public setTokenKey(key: string) {
    this.jwtTokenKey = key
  }

  public getToken() {
    return Cookies.get(this.jwtTokenKey)
  }

  public get expiredTime() {
    const result = jwtParser(this.getToken())
    if (result.success) {
      return (result as Response<true>).exp
    }
    return null
  }

  private setToken({ jwtToken, expiredTime }: payload) {
    Cookies.set(this.jwtTokenKey, jwtToken, {
      expires: new Date(expiredTime * 1000),
      ...this.cookieAttributes,
    })
  }

  private removeToken() {
    Cookies.remove(this.jwtTokenKey, this.cookieAttributes)
  }
}

interface payload {
  jwtToken: string
  expiredTime: number
}
