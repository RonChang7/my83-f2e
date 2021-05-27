import { Route } from 'vue-router'
import { InsuranceListType } from '@/routes/insurance'
import { getFirstQuery } from '@/utils/query-string'

export class Page {
  public insurance: string = ''

  public pagination: number = 1

  public name: InsuranceListType | '' = ''

  public searchKeyword: string = ''

  constructor(route: Route | undefined) {
    if (!route) return

    this.insurance = route.params.insurance
    this.pagination = /^\d+$/.test(getFirstQuery(route.query.page))
      ? Number(getFirstQuery(route.query.page))
      : 1
    this.name = route.name as InsuranceListType
  }

  public isEqualInsurance(page: Page) {
    return this.name === page.name && this.insurance === page.insurance
  }

  public isEqualPagination(page: Page | number) {
    return page instanceof Page
      ? this.pagination === page.pagination
      : this.pagination === page
  }

  public isEqualSearchKeyword(page: Page | string) {
    return page instanceof Page
      ? this.searchKeyword === page.searchKeyword
      : this.searchKeyword === page
  }
}
