import { Context } from '@nuxt/types'
import pageModuleRegister from './page-module-register'
import redirectMiddleware from './redirect'

export default async function (context: Context) {
  return Promise.all([
    await pageModuleRegister(context),
    redirectMiddleware(context),
  ])
}
