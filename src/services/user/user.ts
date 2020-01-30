import Cookies from 'js-cookie'
import { jwtParser, Response } from '@/utils/jwt-parser'

const tokenKey: string = process.env.NUXT_ENV_JWT_TOKEN_NAME!

export class User {
  public static isValid: boolean = false

  public static id: number = 0

  public static role: Role = 'guest'

  public static roleCode: number = -1

  public static firstHttpReferrer: string = ''

  public static firstUrl: string = ''

  private static instance: User

  private constructor() {
    this.updateUser()
  }

  public static getInstance(): User {
    if (!User.instance) {
      User.instance = new User()
    }

    return User.instance
  }

  public updateUser() {
    const jwtToken = Cookies.get(tokenKey)
    const jwtDecode = jwtParser(jwtToken)
    User.isValid = jwtDecode.success

    if (User.isValid) {
      const { role, role_code, sub } = jwtDecode as Response<true>
      User.id = sub
      User.role = role as Role
      User.roleCode = role_code
    } else {
      this.resetUser()
    }
  }

  public updateLandingUrl() {
    User.firstHttpReferrer = document.referrer
    User.firstUrl = window.location.href
  }

  private resetUser() {
    User.id = 0
    User.role = 'guest'
    User.roleCode = -1
  }
}

type Role = 'guest' | 'client' | 'sales' | 'admin' | ''

export interface UrlInfo {
  firstHttpReferrer: string
  firstUrl: string
}
