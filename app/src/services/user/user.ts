import { Auth } from '../auth/auth'
import { Role, RoleCode } from '@/api/header/header.type'
import { Suspect } from '@/services/user/suspect'

export class User {
  private static instance: User

  private role: UserRole = 'guest'

  private roleCode: UserRoleCode = -1

  private firstHttpReferrer: string = ''

  private firstUrl: string = ''

  private isValid: boolean = false

  private constructor() {
    this.validateUser()
  }

  public static getInstance(): User {
    if (!User.instance) {
      User.instance = new User()
      return User.instance
    }

    User.instance.validateUser()
    return User.instance
  }

  public get userState(): UserState {
    return {
      role: this.role,
      roleCode: this.roleCode,
    }
  }

  public get landingUrl(): LandingUrlInfo {
    return {
      firstHttpReferrer: this.firstHttpReferrer,
      firstUrl: this.firstUrl,
    }
  }

  public isGuest() {
    return !this.isValid
  }

  public validateUser() {
    this.isValid = !!Auth.getToken()
  }

  public updateUserState(userState: UserState) {
    this.validateUser()

    if (this.isValid) {
      this.setUser(userState)
      Suspect.setRoleCode()
    } else {
      this.resetUser()
    }
  }

  public updateLandingUrl() {
    this.firstHttpReferrer = document.referrer
    this.firstUrl = window.location.href
  }

  private resetUser() {
    this.role = 'guest'
    this.roleCode = -1
  }

  private setUser({ role, roleCode }: UserState) {
    this.role = role
    this.roleCode = roleCode
  }
}

export type UserRole = Role | 'guest'

export type UserRoleCode = RoleCode | -1

export interface LandingUrlInfo {
  firstHttpReferrer: string
  firstUrl: string
}
export interface UserState {
  role: UserRole
  roleCode: UserRoleCode
}
