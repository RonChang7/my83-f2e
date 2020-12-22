import { Suspect } from './suspect'
import { JWT } from './jwt'
import { cookiesKeyMap } from '@/config/cookies-map'
import { jwtParser, Response } from '@/utils/jwt-parser'
import { Role, RoleCode } from '@/api/type'

export class Auth {
  private jwtTokenKey: string
  private store: Store
  private suspect: Suspect
  private storeOption: StoreOption = {
    path: '/',
    secure: true,
  }

  private _userState: UserState

  private _landingUrlInfo: LandingUrlInfo

  constructor({ jwtTokenKey, store }: AuthConstructPayload) {
    this.jwtTokenKey = jwtTokenKey
    this.store = store
    this.suspect = new Suspect(store, {
      idKey: cookiesKeyMap.MEMBER_ID,
      roleKey: cookiesKeyMap.ROLE,
    })

    this._userState = {
      id: 0,
      role: 'guest',
      roleCode: -1,
      nickname: '',
    }

    this._landingUrlInfo = {
      firstHttpReferrer: '',
      firstUrl: '',
    }
  }

  public get isLogin() {
    return !!this.getToken()
  }

  public get userState() {
    return this._userState
  }

  public get landingUrl() {
    return this._landingUrlInfo
  }

  public get suspectRole() {
    return this.suspect.role
  }

  public get suspectMemberId() {
    return this.suspect.id
  }

  private get expiredTime() {
    const result = jwtParser(this.getToken())
    if (result.success) {
      return (result as Response<true>).exp
    }
    return null
  }

  public login(payload: payload) {
    this.setToken(payload)
  }

  public logout() {
    if (this.isLogin) {
      this.suspect.role = this.userState.roleCode as RoleCode
      this.suspect.id = this.userState.id.toString()
    }
    this.removeToken()
  }

  public refreshToken(baseURL: string) {
    return new Promise((resolve, reject) => {
      JWT.refreshToken(baseURL, {
        jwtToken: this.getToken() as string,
        expiredTime: this.expiredTime as number,
      })
        .then((data) => {
          this.setToken(data)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  public getToken() {
    return this.store.get(this.jwtTokenKey)
  }

  public setTokenKey(key: string) {
    this.jwtTokenKey = key
  }

  public setUserState(userState: UserState) {
    if (this.isLogin) {
      this._userState = userState
    } else {
      this.resetUserState()
    }
  }

  public setLandingUrl() {
    this._landingUrlInfo = {
      firstHttpReferrer: document.referrer,
      firstUrl: window.location.href,
    }
  }

  private resetUserState() {
    this._userState = {
      id: 0,
      role: 'guest',
      roleCode: -1,
      nickname: '',
    }
  }

  private setToken({ jwtToken, expiredTime }: payload) {
    this.store.set(this.jwtTokenKey, jwtToken, {
      expires: new Date(expiredTime * 1000),
      ...this.storeOption,
    })
  }

  private removeToken() {
    this.store.remove(this.jwtTokenKey, this.storeOption)
  }
}

interface AuthConstructPayload {
  jwtTokenKey: string
  store: Store
}

interface payload {
  jwtToken: string
  expiredTime: number
}

interface Store {
  get(key: string): string | undefined
  set(key: string, value: string | undefined, option?: StoreOption): void
  remove(key: string, option?: StoreOption): void
}

interface StoreOption {
  path?: string
  expires?: Date
  secure?: boolean
}

export type UserRole = Role | 'guest'

export type UserRoleCode = RoleCode | -1

export const UserRoleMap: Record<UserRole, string> = {
  client: '保戶',
  sales: '業務員',
  guest: '訪客',
}

export interface LandingUrlInfo {
  firstHttpReferrer: string
  firstUrl: string
}
export interface UserState {
  id: number
  role: UserRole
  roleCode: UserRoleCode
  nickname: string
}
