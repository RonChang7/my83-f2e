import _ from 'lodash'
import { Route } from 'vue-router'
import { addQueryStringToPath } from '@/utils/query-string'

export class CanonicalService {
  static getCanonical({
    hostname,
    route,
    acceptedQueryStringKeys,
  }: getCanonicalPayload) {
    const path = addQueryStringToPath(
      route.path,
      _.pick(route.query, acceptedQueryStringKeys)
    )

    return `${hostname}${path}`
  }
}

interface getCanonicalPayload {
  hostname: string
  route: Route
  acceptedQueryStringKeys: string[]
}
