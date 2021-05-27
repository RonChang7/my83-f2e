import _ from 'lodash'
import { Route } from 'vue-router'

export class Filter {
  constructor(
    private query: Route['query'] | undefined,
    private acceptKeys?: string[]
  ) {}

  static normalizeFilterDto(
    query: Record<string, any> | null | undefined
  ): Record<string, any> | null | undefined {
    if (!query) return query

    return _.reduce(
      _.cloneDeep(query),
      (result, value, key) => {
        if (_.isEmpty(value)) return result

        result[key] = _.isArray(value) ? value.sort() : value
        return result
      },
      {}
    )
  }

  public createDto() {
    return Filter.normalizeFilterDto(
      this.acceptKeys ? _.pick(this.query, this.acceptKeys) : this.query
    )
  }

  public isEqual(
    filter: Filter | ReturnType<typeof Filter.normalizeFilterDto>
  ) {
    return filter instanceof Filter
      ? _.isEqual(this.createDto(), filter.createDto())
      : _.isEqual(this.createDto(), filter)
  }
}
