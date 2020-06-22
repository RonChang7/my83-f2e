import _ from 'lodash'
import qs from 'qs'
import { Route } from 'vue-router'

export function addQueryStringToPath(path: string, queryMap: {} | string) {
  const [originalPath, search = ''] = path.split('?')
  const originalQueryData = qs.parse(search)

  const additionalQueryData = _.isString(queryMap)
    ? qs.parse(queryMap)
    : queryMap

  const newQueryData = { ...originalQueryData, ...additionalQueryData }

  return _.isEmpty(newQueryData)
    ? originalPath
    : originalPath + '?' + qs.stringify(newQueryData)
}

export const getFirstQuery = (
  q: Route['query'][keyof Route['query']]
): string => {
  if (_.isString(q)) return q
  if (_.isArray(q) && _.isString(q[0])) return q[0]
  return ''
}
