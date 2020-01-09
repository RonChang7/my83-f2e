import Cookies from 'js-cookie'
import { jwtParser, Response } from '@/utils/jwt-parser'

const tokenKey: string = process.env.NUXT_ENV_JWT_TOKEN_NAME!

export class User {
  public static isValid: boolean = false

  public static id: number = 0

  public static role: Role = ''

  public static roleCode: number = -1

  private static instance: User

  private constructor() {
    this.UpdateUser()
  }

  public static getInstance(): User {
    if (!User.instance) {
      User.instance = new User()
    }

    return User.instance
  }

  public UpdateUser() {
    const jwtToken = Cookies.get(tokenKey)
    const jwtDecode = jwtParser(jwtToken)
    User.isValid = jwtDecode.success

    if (User.isValid) {
      const { role, role_code, uid } = (jwtDecode as Response<true>).sub
      User.id = uid
      User.role = role as Role
      User.roleCode = role_code
    } else {
      this.resetUser()
    }
  }

  private resetUser() {
    User.id = 0
    User.role = ''
    User.roleCode = -1
  }
}

type Role = 'guest' | 'client' | 'sales' | 'admin' | ''
