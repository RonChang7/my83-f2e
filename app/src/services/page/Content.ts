import { Context } from '@nuxt/types'
import { FETCH_HEADER_NAV_DATA } from '@/store/header/header.type'
import { GlobalVuexState } from '@/store/global-state'

export class Content {
  public static requests(ctx: Context) {
    const requests: Promise<any>[] = []

    if (Content._shouldFetchHeaderData(ctx)) {
      requests.push(ctx.store.dispatch(`header/${FETCH_HEADER_NAV_DATA}`))
    }

    return requests
  }

  private static _shouldFetchHeaderData({ store, route }: Context) {
    return (
      !route.meta.hideHeader &&
      !(store.state as GlobalVuexState).header.headerNavItems.length
    )
  }
}
