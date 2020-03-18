import _ from 'lodash'
import qs from 'qs'

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
