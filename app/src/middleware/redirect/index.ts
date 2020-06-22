import { Context } from '@nuxt/types'
import { rules as redirectRules } from './redirect-map'

const redirectMiddleware = ({ route, redirect }: Context) => {
  redirectRules.forEach((rule) => {
    if (rule.from(route)) {
      const { status, path, query } = rule.to(route)
      return redirect(status, path, query)
    }
  })
}

export default redirectMiddleware
