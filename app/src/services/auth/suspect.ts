import { RoleCode } from '@/api/type'

// 嫌疑犯檢查功能
export class Suspect {
  private storeOption: StoreOption = {
    path: '/',
  }

  constructor(
    private store: Store,
    private storeKey: {
      idKey: string
      roleKey: string
    }
  ) {}

  public get id() {
    return this.store.get(this.storeKey.idKey)
  }

  public set id(value) {
    this._set(this.storeKey.idKey, value)
  }

  public get role() {
    return Number(this.store.get(this.storeKey.roleKey)) as RoleCode
  }

  public set role(value: RoleCode) {
    this._set(this.storeKey.roleKey, value.toString())
  }

  private _set(key: string, value: string | undefined) {
    this.store.set(key, value, this.storeOption)
  }
}

interface Store {
  get(key: string): string | undefined
  set(key: string, value: string | undefined, option?: StoreOption): void
}

interface StoreOption {
  path?: string
}
