import _ from 'lodash'
import { CookiesKey } from '@/plugins/cookies'

// 嫌疑犯檢查功能
export class Suspect {
  private storeOption: StoreOption = {
    path: '/',
  }

  constructor(private store: Store, private storeKeyMap: Partial<CookiesKey>) {}

  public set(payload: Record<string, string>) {
    _.forEach(payload, (value, key) => {
      if (!_.includes(this.storeKeyMap, key))
        throw new Error(`${key} is not exist in list!`)

      this._set(key, value)
    })
  }

  public get(key: string) {
    return this.store.get(key)
  }

  private _set(key: string, value: string) {
    if (!this.get(key)) {
      this.store.set(key, value, this.storeOption)
    }
  }
}

interface Store {
  get(key: string): string | undefined
  set(key: string, value: string | object, option?: StoreOption): void
}

interface StoreOption {
  path?: string
}
