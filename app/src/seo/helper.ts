import _ from 'lodash'

export const getJsonLdScript = (jsonLds: [] | null): Array<any> => {
  if (!_.isArray(jsonLds)) return []

  return jsonLds.map((jsonLd) => {
    try {
      return {
        innerHTML: JSON.stringify(jsonLd),
        type: 'application/ld+json',
      }
    } catch (e) {
      console.error(e)
      return null
    }
  })
}
