// 嫌疑犯檢查功能
export class Suspect {
  private static instance: Suspect

  private store: Store

  private storeOption: StoreOption

  private constructor() {
    this.storeOption = {
      path: '/',
    }
  }

  public static getInstance(): Suspect {
    if (!Suspect.instance) {
      Suspect.instance = new Suspect()
    }

    return Suspect.instance
  }

  public setStore(store: Store) {
    this.store = store
  }

  public get(key: string) {
    return this.store.get(key)
  }

  public set(key: string, value: string) {
    this.store.set(key, value, this.storeOption)
  }
}

interface Store {
  get(key: string): string | undefined
  set(key: string, value: string | object, option?: StoreOption): void
}

interface StoreOption {
  path?: string
}
