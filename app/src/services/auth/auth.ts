import { Suspect } from './suspect'
import { JWT } from './jwt'
import { CookiesKey } from '@/plugins/cookies'
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

  private suspectStoreKeyMap: Partial<CookiesKey>

  private _userState: UserState

  private _landingUrlInfo: LandingUrlInfo

  constructor({
    jwtTokenKey,
    store,
    suspectStoreKeyMap,
  }: AuthConstructPayload) {
    this.jwtTokenKey = jwtTokenKey
    this.store = store
    this.suspectStoreKeyMap = suspectStoreKeyMap
    this.suspect = new Suspect(store, suspectStoreKeyMap)

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
    return this.suspect.get(this.suspectStoreKeyMap.ROLE!)
  }

  public get suspectMemberId() {
    return this.suspect.get(this.suspectStoreKeyMap.MEMBER_ID!)
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
    if (this.userState.id > 0) {
      this.suspect.set({
        [this.suspectStoreKeyMap.ROLE!]: this.userState.roleCode.toString(),
        [this.suspectStoreKeyMap.MEMBER_ID!]: this.userState.id.toString(),
      })
    }
    this.removeToken()
  }

  public refreshToken(baseURL: string) {
    return new Promise((resolve, reject) => {
      JWT.refreshToken(baseURL, {
        jwtToken: this.getToken() || '',
        expiredTime: this.expiredTime || 0,
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
  suspectStoreKeyMap: Partial<CookiesKey>
}

interface payload {
  jwtToken: string
  expiredTime: number
}

interface Store {
  get(key: string): string | undefined
  set(key: string, value: string | object, option?: StoreOption): void
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
