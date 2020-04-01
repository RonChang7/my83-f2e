import { addQueryStringToPath } from '@/utils/query-string'

const shouldDecorateSeo = process.server

export function decorateSeoQueryString(path: string) {
  if (path.length <= 0 || !shouldDecorateSeo) return path

  return addQueryStringToPath(path, { seo: 1 })
}
