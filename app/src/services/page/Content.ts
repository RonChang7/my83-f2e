import { Context } from '@nuxt/types'
import { pageRequestMap } from './page-request-map'

export class Content {
  public static requests(ctx: Context): Promise<any>[] {
    return pageRequestMap.reduce<Promise<any>[]>((promises, request) => {
      if (request.shouldFetchRequest(ctx)) {
        promises.push(request.promise(ctx))
      }
      return promises
    }, [])
  }
}
