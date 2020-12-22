import { Role } from '@/api/type'

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
    return this.store.get(this.storeKey.roleKey) as Role
  }

  public set role(value: Role) {
    this._set(this.storeKey.roleKey, value)
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
