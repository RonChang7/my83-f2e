import { jwtParser, Response } from '@/utils/jwt-parser'

export class Auth {
  private static instance: Auth

  private jwtTokenKey: string

  private store: Store

  private storeOption: StoreOption

  private constructor() {
    this.storeOption = {
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

  get isLogin() {
    return !!this.getToken()
  }

  public setStore(store: Store) {
    this.store = store
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
    if (!this.checkIfStoreExisted()) throw new Error('Store is not exist!')

    return this.store.get(this.jwtTokenKey)
  }

  public get expiredTime() {
    const result = jwtParser(this.getToken())
    if (result.success) {
      return (result as Response<true>).exp
    }
    return null
  }

  private setToken({ jwtToken, expiredTime }: payload) {
    if (!this.checkIfStoreExisted()) throw new Error('Store is not exist!')

    this.store.set(this.jwtTokenKey, jwtToken, {
      expires: new Date(expiredTime * 1000),
      ...this.storeOption,
    })
  }

  private removeToken() {
    if (!this.checkIfStoreExisted()) throw new Error('Store is not exist!')

    this.store.remove(this.jwtTokenKey, this.storeOption)
  }

  private checkIfStoreExisted() {
    return !!this.store
  }
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
