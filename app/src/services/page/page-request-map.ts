import { Context } from '@nuxt/types'
import { FETCH_HEADER_NAV_DATA } from '@/store/header/header.type'
import { GlobalVuexState } from '@/store/global-state'

export const pageRequestMap: Request[] = [
  {
    // Header menu API
    promise: ({ store }) => store.dispatch(`header/${FETCH_HEADER_NAV_DATA}`),
    shouldFetchRequest: ({ store, route }) => {
      return (
        !route.meta.hideHeader &&
        !(store.state as GlobalVuexState).header.headerNavItems.length
      )
    },
  },
]

interface Request {
  promise(ctx: Context): Promise<any>
  shouldFetchRequest(ctx: Context): boolean
}
