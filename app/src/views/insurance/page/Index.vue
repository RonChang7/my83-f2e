<script lang="ts">
import _ from 'lodash'
import qs from 'qs'
import {
  defineAsyncComponent,
  defineComponent,
  h,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { Route } from 'vue-router'
import { Store } from 'vuex'
import { Context } from '@nuxt/types'
import { ErrorPageType } from '@/config/error-page.config'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/insurance/insurance'
import { Content } from '@/services/page/Content'
import { InsuranceListType } from '@/routes/insurance'
import { FetchInsuranceListPayload } from '@/api/insurance/insurance.type'
import {
  FETCH_PAGE_DATA,
  FETCH_INSURANCE_LIST,
  UPDATE_INSURANCE_PRODUCT_FEE,
  FETCH_INSURANCE_LIST_FILTER,
} from '@/store/insurance/insurance.type'
import { getFirstQuery } from '@/utils/query-string'
import { OnRedirectingException } from '@/api/errors/OnRedirectingException'
import { isAxiosError } from '@/api/helper'
import { CanonicalService } from '@/seo/canonical-service'
const InsurancePage = defineAsyncComponent(() => import('./InsurancePage.vue'))

class PageDataService {
  private routeName: InsuranceListType

  private from: Route

  private route: Route

  private store: Store<InsuranceVuexState>

  constructor(ctx: Context) {
    this.routeName = ctx.route!.name as InsuranceListType
    this.from = ctx.from
    this.route = ctx.route
    this.store = ctx.store
  }

  public fetchData() {
    return [
      ...this.fetchPageData(),
      ...this.fetchListData(),
      ...this.updateFilterData(),
    ]
  }

  public getNormalizedQuery() {
    const removedQuery: string[] = []

    if (this.isDefaultFilter) {
      removedQuery.push(...this.filterKeys)
    }

    return _.omit(this.route.query, removedQuery)
  }

  public updateExternalProductFee() {
    return this.store.dispatch(
      `insurance/${UPDATE_INSURANCE_PRODUCT_FEE}`,
      this.getCurrentFilter()
    )
  }

  private fetchPageData() {
    if (this.insurance === this.currentInsurance) return []

    switch (this.routeName) {
      case InsuranceListType.NORMAL:
        return [
          this.store.dispatch(`insurance/${FETCH_PAGE_DATA}`, this.insurance),
          this.store.dispatch(
            `insurance/${FETCH_INSURANCE_LIST_FILTER}`,
            this.insurance
          ),
        ]
      case InsuranceListType.EXTERNAL:
        return [
          this.store.dispatch(`insurance/${FETCH_PAGE_DATA}`, this.insurance),
        ]
      default:
        return []
    }
  }

  private fetchListData() {
    const page = /^\d+$/.test(getFirstQuery(this.route.query.page))
      ? Number(getFirstQuery(this.route.query.page))
      : 1
    const currentParam = this.store.state.insurance.currentParam

    const payload: FetchInsuranceListPayload = {
      insurance: this.insurance,
      page,
      filters: this.route.query,
    }

    if (
      this.from?.name !== this.route?.name ||
      this.insurance !== this.currentInsurance ||
      page !== currentParam.page
    ) {
      return [
        this.store
          .dispatch(`insurance/${FETCH_INSURANCE_LIST}`, payload)
          .then(() => {
            if (this.route.name === InsuranceListType.EXTERNAL) {
              return this.updateExternalProductFee()
            }
          }),
      ]
    }
    return []
  }

  private updateFilterData() {
    if (this.insurance !== this.currentInsurance) return []

    const oldFilterQuery = _.pick(this.from?.query, this.filterKeys)
    const newFilterQuery = _.pick(this.route.query, this.filterKeys)
    const defaultQuery = this.store.state.insurance.filter.defaultValue
    const currentApiFilterConfig = this.store.state.insurance.meta
      ?.currentFilterConfig

    if (
      _.isEqual(
        _.isEmpty(newFilterQuery)
          ? this.normalizeQuery(defaultQuery)
          : this.normalizeQuery(newFilterQuery),
        this.normalizeQuery(currentApiFilterConfig)
      )
    )
      return []

    if (_.isEqual(oldFilterQuery, newFilterQuery)) return []
    switch (this.routeName) {
      case InsuranceListType.NORMAL: {
        const payload: FetchInsuranceListPayload = {
          insurance: this.insurance,
          page: 1,
          filters: this.getCurrentFilter(),
        }
        return [
          this.store.dispatch(`insurance/${FETCH_INSURANCE_LIST}`, payload),
        ]
      }
      case InsuranceListType.EXTERNAL:
        return [this.updateExternalProductFee()]
      default:
        return []
    }
  }

  public get isDefaultFilter() {
    if (_.isEmpty(this.route.query) || !this.filterKeys.length) return false

    const query = qs.parse(
      qs.stringify(this.route.query, { arrayFormat: 'repeat' })
    )
    const defaultQuery = qs.parse(
      qs.stringify(this.store.state.insurance.filter.defaultValue, {
        arrayFormat: 'repeat',
      })
    )

    return _.isEqual(
      this.normalizeQuery(query),
      this.normalizeQuery(defaultQuery)
    )
  }

  private get insurance() {
    return this.route.params.insurance
  }

  private get currentInsurance() {
    return this.store.state.insurance.staticData.id
  }

  private get filterKeys() {
    return _.keys(this.store.state.insurance.filter.defaultValue)
  }

  private getCurrentFilter() {
    const filterFromQuery = this.filterKeys.reduce((acc, cur) => {
      if (this.route.query[cur]) {
        acc[cur] = this.route.query[cur]
      }
      return acc
    }, {})

    return _.isEmpty(filterFromQuery)
      ? this.store.state.insurance.filter.defaultValue
      : {
          ...this.store.state.insurance.filter.defaultValue,
          ...filterFromQuery,
        }
  }

  private normalizeQuery(query?: Record<string, any> | null) {
    if (!query) return query

    return _.reduce(
      _.cloneDeep(query),
      (result, value, key) => {
        result[key] = _.isArray(value) ? value.sort() : value
        return result
      },
      {}
    )
  }
}

export default defineComponent({
  scrollToTop: false,
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toPage = (index: number) => {
      router.push({
        query: {
          ...route.value.query,
          page: String(index),
        },
      })
    }

    return () =>
      h(InsurancePage, {
        on: {
          'to-page': toPage,
        },
      })
  },
  async asyncData(ctx) {
    const { error, route, query, redirect } = ctx
    const store = ctx.store as Store<InsuranceVuexState>
    const pageDataService = new PageDataService(ctx)

    const fetchPageData: Promise<any>[] = []
    fetchPageData.push(...pageDataService.fetchData())

    try {
      await Promise.all([...Content.requests(ctx), ...fetchPageData])
    } catch (err) {
      if (!isAxiosError(err)) throw err

      if (err instanceof OnRedirectingException) {
        const redirectLink = err.getRedirectLink()
        redirect(redirectLink)
        return
      }

      const statusCode =
        err.response?.status === 404 ? err.response.status : 500
      const message = statusCode ? ErrorPageType.DEFAULT : ErrorPageType.SERVER

      return error({
        statusCode,
        message,
      })
    }

    if (pageDataService.isDefaultFilter) {
      redirect({ query: pageDataService.getNormalizedQuery() })
      return
    }

    const shouldRedirect = query.page === '1'
    if (shouldRedirect) {
      redirect({ query: _.omit(query, ['page']) })
      return
    }

    // 如果頁面超過最大頁面，則導回該險種第一頁
    if (
      store.state.insurance.meta!.pagination.currentPage >
      store.state.insurance.meta!.pagination.totalPage
    ) {
      redirect({ name: route.name! })
    }
  },
  head() {
    const filterKeys = _.keys(this.$store.state.insurance.filter.defaultValue)
    const canonical = CanonicalService.getCanonical({
      hostname: this.$env.HOST_URL,
      route: this.$route,
      acceptedQueryStringKeys: ['page', ...filterKeys],
    })

    return {
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: canonical,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: canonical,
        },
      ],
    }
  },
  watchQuery: true,
})

export interface InsuranceVuexState extends GlobalVuexState {
  insurance: State
}
</script>
