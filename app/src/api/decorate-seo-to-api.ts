import { addQueryStringToPath } from '@/utils/query-string'

const shouldDecorateSeo = process.server

export function decorateSeoQueryString(path: string) {
  if (path.length <= 0 || !shouldDecorateSeo) return path

  if (path.includes('/api/insurance/search')) {
    console.log(`\x1B[32mSkip SEO decoration for search API: ${path}\x1B[0m`)
    return path
  }

  return addQueryStringToPath(path, { seo: 1 })
}
