import _ from 'lodash'
import { Store } from 'vuex'
import { Context } from '@nuxt/types'
import { ErrorPageType } from '@/config/error-page.config'
import { Filter } from '@/services/filter/Filter'
import { Page } from '@/services/page/insurance/Page'
import { InsuranceListType } from '@/routes/insurance'
import { getFirstQuery } from '@/utils/query-string'
import { OnRedirectingException } from '@/api/errors/OnRedirectingException'
import { isAxiosError } from '@/api/helper'
import { State } from '@/store/insurance/insurance'

import {
  FetchInsuranceListPayload,
  FetchInsuranceSearchListPayload,
  InsuranceListFilterResponse,
} from '@/api/insurance/insurance.type'
import {
  FETCH_PAGE_DATA,
  FETCH_INSURANCE_LIST,
  UPDATE_INSURANCE_PRODUCT_FEE,
  FETCH_TAG_LIST_FILTER,
  FETCH_TAG_LIST,
  FETCH_INSURANCE_SEARCH_LIST,
  FETCH_INSURANCE_SEARCH_LIST_FILTER,
  FETCH_SEARCH_NO_RESULT,
  FETCH_INSURANCE_OPTIONS,
  FETCH_INSURANCE_SEARCH_PRODUCT,
  SET_NO_RESULT,
} from '@/store/insurance/insurance.type'

interface StoreState {
  insurance: State
}

abstract class InsurancePage {
  protected page: Page

  protected filter: Filter

  protected acceptFilterKeys: string[]

  protected store: Store<StoreState>

  constructor(protected ctx: Context) {
    this.store = this.ctx.store
    this.acceptFilterKeys = _.keys(
      this.store.state.insurance.filter.defaultValue
    )
    this.page = new Page(this.ctx.route)
    this.filter = new Filter(this.ctx.route.query, this.acceptFilterKeys)
    this.page.searchKeyword = getFirstQuery(this.ctx.route.query.q)
  }

  protected abstract fetchPageDataRequests(): Promise<unknown>[]

  protected abstract fetchListDataRequests(): Promise<unknown>[]

  protected abstract fetchFilteredDataRequests(): Promise<unknown>[]
}

class NormalInsurancePage extends InsurancePage {
  constructor(ctx: Context) {
    super(ctx)
  }

  protected fetchPageDataRequests() {
    console.log('fetchPageDataRequests')

    return [
      this.store.dispatch(`insurance/${FETCH_INSURANCE_OPTIONS}`),
      this.store.dispatch(`insurance/${FETCH_INSURANCE_SEARCH_PRODUCT}`, {
        searchText: this.page.searchKeyword,
        categoryId: '',
        caseId: '',
        typeId: '',
        tagId: '',
        page: 1,
        perPage: 10,
      }),
    ]
  }

  protected fetchListDataRequests() {
    const payload: FetchInsuranceListPayload = {
      insurance: this.page.insurance,
      page: this.page.pagination,
      filters: this.ctx.route.query,
    }

    return [this.store.dispatch(`insurance/${FETCH_INSURANCE_LIST}`, payload)]
  }

  protected fetchFilteredDataRequests() {
    const defaultFilterQuery = Filter.normalizeFilterDto(
      this.store.state.insurance.filter.defaultValue
    )

    const payload: FetchInsuranceListPayload = {
      insurance: this.page.insurance,
      page: 1,
      filters: {
        ...defaultFilterQuery,
        ...this.filter.createDto(),
      },
    }

    return [this.store.dispatch(`insurance/${FETCH_INSURANCE_LIST}`, payload)]
  }
}

class ExternalInsurancePage extends InsurancePage {
  constructor(ctx: Context) {
    super(ctx)
  }

  protected fetchPageDataRequests() {
    return [
      this.store.dispatch(`insurance/${FETCH_PAGE_DATA}`, this.page.insurance),
    ]
  }

  protected fetchListDataRequests() {
    const payload: FetchInsuranceListPayload = {
      insurance: this.page.insurance,
      page: this.page.pagination,
      filters: this.ctx.route.query,
    }

    return [
      this.store
        .dispatch(`insurance/${FETCH_INSURANCE_LIST}`, payload)
        .then(() => this.updateProductFeeRequest()),
    ]
  }

  protected fetchFilteredDataRequests() {
    return [this.updateProductFeeRequest()]
  }

  private updateProductFeeRequest() {
    const defaultFilterQuery = Filter.normalizeFilterDto(
      this.store.state.insurance.filter.defaultValue
    )

    return this.store.dispatch(`insurance/${UPDATE_INSURANCE_PRODUCT_FEE}`, {
      ...defaultFilterQuery,
      ...this.filter.createDto(),
    })
  }
}

class FeatureTagInsurancePage extends InsurancePage {
  constructor(ctx: Context) {
    super(ctx)
  }

  protected fetchPageDataRequests() {
    return [
      this.store.dispatch(
        `insurance/${FETCH_TAG_LIST_FILTER}`,
        this.page.insurance
      ),
    ]
  }

  protected fetchListDataRequests() {
    const payload: FetchInsuranceListPayload = {
      insurance: this.page.insurance,
      page: this.page.pagination,
      filters: this.ctx.route.query,
    }

    return [this.store.dispatch(`insurance/${FETCH_TAG_LIST}`, payload)]
  }

  protected fetchFilteredDataRequests() {
    const defaultFilterQuery = Filter.normalizeFilterDto(
      this.store.state.insurance.filter.defaultValue
    )

    const payload: FetchInsuranceListPayload = {
      insurance: this.page.insurance,
      page: 1,
      filters: {
        ...defaultFilterQuery,
        ...this.filter.createDto(),
      },
    }

    return [this.store.dispatch(`insurance/${FETCH_TAG_LIST}`, payload)]
  }
}

class SearchInsurancePage extends InsurancePage {
  constructor(ctx: Context) {
    super(ctx)
  }

  protected fetchPageDataRequests() {
    return [
      (this.store.dispatch(
        `insurance/${FETCH_INSURANCE_SEARCH_LIST_FILTER}`,
        this.page.searchKeyword
      ) as Promise<InsuranceListFilterResponse>).then((data) => {
        const isEmptySearchFilter = !_.every(
          data.filter_config,
          (field) => field.values.length > 0
        )

        return isEmptySearchFilter
          ? this.store.dispatch(`insurance/${FETCH_SEARCH_NO_RESULT}`)
          : null
      }),
    ]
  }

  protected fetchListDataRequests() {
    const payload: FetchInsuranceSearchListPayload = {
      q: this.page.searchKeyword,
      page: this.page.pagination,
      filters: this.ctx.route.query,
    }

    return [
      this.store.dispatch(`insurance/${FETCH_INSURANCE_SEARCH_LIST}`, payload),
    ]
  }

  protected fetchFilteredDataRequests() {
    const defaultFilterQuery = Filter.normalizeFilterDto(
      this.store.state.insurance.filter.defaultValue
    )

    const payload: FetchInsuranceSearchListPayload = {
      q: this.page.searchKeyword,
      page: 1,
      filters: {
        ...defaultFilterQuery,
        ...this.filter.createDto(),
      },
    }

    return [
      this.store.dispatch(`insurance/${FETCH_INSURANCE_SEARCH_LIST}`, payload),
    ]
  }
}

export class InsuranceFactory {
  static create(ctx: Context) {
    const routeName = ctx.route.name as InsuranceListType

    switch (routeName) {
      case InsuranceListType.NORMAL:
        return new NormalInsurancePage(ctx)
      case InsuranceListType.EXTERNAL:
        return new ExternalInsurancePage(ctx)
      case InsuranceListType.FEATURE_TAG:
        return new FeatureTagInsurancePage(ctx)
      case InsuranceListType.SEARCH:
        return new SearchInsurancePage(ctx)
    }
  }
}

export class InsurancePageService {
  private page: InsurancePage

  private defaultFilterQuery: ReturnType<typeof Filter.normalizeFilterDto>

  private filter: Filter

  private acceptFilterKeys: string[]

  private store: Store<StoreState>

  constructor(private ctx: Context) {
    this.store = this.ctx.store
    this.page = InsuranceFactory.create(this.ctx)!
    this.defaultFilterQuery = Filter.normalizeFilterDto(
      this.store.state.insurance.filter.defaultValue
    )

    this.acceptFilterKeys = _.keys(
      this.store.state.insurance.filter.defaultValue
    )

    this.filter = new Filter(this.ctx.route.query, this.acceptFilterKeys)
  }

  public async fetchData() {
    try {
      await this.store.dispatch(`insurance/${FETCH_INSURANCE_OPTIONS}`)
      const currentQuery = this.ctx.route.query
      await this.store.dispatch(`insurance/${FETCH_INSURANCE_SEARCH_PRODUCT}`, {
        searchText: currentQuery.q || '',
        categoryId: currentQuery.categoryId || '',
        caseId: currentQuery.caseId || '',
        typeId: currentQuery.typeId || '',
        tagId: currentQuery.tagId || '',
        page: parseInt(currentQuery.page as string) || 1,
        perPage: 10,
      })
      const res = this.store.state.insurance.insuranceSearchProduct
      if (res && res.length === 0) {
        this.store.commit(`insurance/${SET_NO_RESULT}`, true)
        return
      }
      this.store.commit(`insurance/${SET_NO_RESULT}`, false)
    } catch (error) {
      console.error('error:', error)
    }
  }

  public reconcileRoute() {
    let query = Filter.normalizeFilterDto(this.ctx.route.query) || {}
    let shouldReconcileRoute = false

    if (
      this.filter.isEqual(this.defaultFilterQuery) &&
      !_.isEmpty(this.defaultFilterQuery)
    ) {
      query = _.omit(query, this.acceptFilterKeys)

      shouldReconcileRoute = true
    }

    if (query.page === '1') {
      query = _.omit(query, ['page'])

      shouldReconcileRoute = true
    }

    if (shouldReconcileRoute) {
      this.ctx.redirect({ query })
      return
    }

    // 如果頁面超過最大頁面，則導回該險種第一頁
    if (
      this.store.state.insurance.meta!.pagination.currentPage >
      this.store.state.insurance.meta!.pagination.totalPage
    ) {
      this.ctx.redirect({ name: this.ctx.route.name! })
    }
  }

  private handleFetchFailed(err: any) {
    if (err instanceof OnRedirectingException) {
      const redirectLink = err.getRedirectLink()
      this.ctx.redirect(redirectLink)
      return
    }

    if (!isAxiosError(err)) throw err

    const statusCode = err.response?.status === 404 ? err.response.status : 500
    const message = statusCode ? ErrorPageType.DEFAULT : ErrorPageType.SERVER

    return this.ctx.error({
      statusCode,
      message,
    })
  }
}
