import { Route } from 'vue-router'

export default class CanonicalService {
  static getCanonical(hostname: string, route: Route) {
    return `${hostname}${route.path}`
  }
}
