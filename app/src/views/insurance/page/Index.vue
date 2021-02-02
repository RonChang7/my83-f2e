<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Context } from '@nuxt/types'
import { ErrorPageType } from '@/config/error-page.config'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/insurance/insurance'
import { Content } from '@/services/page/Content'
import { FetchInsuranceListPayload } from '@/api/insurance/insurance.type'
import {
  FETCH_PAGE_DATA,
  FETCH_INSURANCE_LIST,
  UPDATE_INSURANCE_PRODUCT_FEE,
} from '@/store/insurance/insurance.type'
import { getFirstQuery } from '@/utils/query-string'
import { OnRedirectingException } from '@/api/errors/OnRedirectingException'
import { isAxiosError } from '@/api/helper'
import { CanonicalService } from '@/seo/canonical-service'
const InsurancePage = () => import('./InsurancePage.vue')

const opinions: ComponentOption = {
  watchQuery: true,
  async asyncData(ctx) {
    const { error, route, query, store, redirect } = ctx
    const insurance = route.params.insurance
    const insuranceStore = (store.state as InsuranceVuexState).insurance
    const currentInsurance = insuranceStore.staticData.id

    const fetchPageData: Promise<any>[] = []

    if (insurance !== currentInsurance) {
      fetchPageData.push(
        store.dispatch(`insurance/${FETCH_PAGE_DATA}`, insurance)
      )
    }

    const fetchListData = fetchList(insurance, ctx)

    if (fetchListData) {
      fetchPageData.push(fetchListData)
    }

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

    const pageFilter = new PageFilterService(ctx)

    if (pageFilter.isDefaultFilter) {
      return pageFilter.removeFilterQueryString()
    }

    if (
      !(
        pageFilter.isFirstLanding &&
        (pageFilter.isDefaultFilter || pageFilter.isEmptyFilter)
      )
    ) {
      await pageFilter.fetchInsuranceProductFee()
    }

    const shouldRedirect = query.page === '1'
    if (shouldRedirect) {
      redirect({ query: _.omit(query, ['page']) })
      return
    }

    // 如果頁面超過最大頁面，則導回該險種第一頁
    if (
      insuranceStore.meta!.pagination.currentPage >
      insuranceStore.meta!.pagination.totalPage
    ) {
      redirect({ name: route.name! })
    }
  },
  head() {
    const filterKeys = _.keys(
      this.$store.state.insurance.filter.defaultPremiumConfig
    )
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
  methods: {
    toPage(index) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: String(index),
        },
      })
    },
  },
  render(h) {
    return h(InsurancePage, {
      on: {
        'to-page': this.toPage,
      },
    })
  },
}

const fetchList = (
  insurance: string,
  { query, store, from, route }: Context
) => {
  const insuranceStore = (store.state as InsuranceVuexState).insurance
  const page = /^\d+$/.test(getFirstQuery(query.page))
    ? Number(getFirstQuery(query.page))
    : 1
  const currentParam = insuranceStore.currentParam
  const currentInsurance = insuranceStore.staticData.id

  const payload: FetchInsuranceListPayload = {
    insurance,
    page,
  }

  if (
    from?.name !== route?.name ||
    insurance !== currentInsurance ||
    page !== currentParam.page
  ) {
    return store.dispatch(`insurance/${FETCH_INSURANCE_LIST}`, payload)
  }
}

class PageFilterService {
  private filterKeys: string[]

  constructor(private ctx: Context) {
    this.filterKeys = _.keys(
      (ctx.store.state as InsuranceVuexState).insurance.filter
        .defaultPremiumConfig
    )
  }

  removeFilterQueryString() {
    const { query, redirect } = this.ctx
    this.filterKeys.forEach((key) => {
      delete query[key]
    })

    redirect({
      query,
    })
  }

  async fetchInsuranceProductFee() {
    await this.ctx.store.dispatch(
      `insurance/${UPDATE_INSURANCE_PRODUCT_FEE}`,
      this.premiumConfig
    )
  }

  get isDefaultFilter() {
    const { query, store } = this.ctx
    if (_.isEmpty(query)) return false

    return this.filterKeys.every(
      (key) =>
        getFirstQuery(query[key]) ===
        (store.state as InsuranceVuexState).insurance.filter
          .defaultPremiumConfig?.[key]
    )
  }

  get isEmptyFilter() {
    const { query } = this.ctx
    if (_.isEmpty(query)) return true

    return this.filterKeys.every((key) => getFirstQuery(query[key]) === '')
  }

  get isFirstLanding() {
    const { from, route } = this.ctx
    return (
      from === undefined || from.params.insurance !== route.params.insurance
    )
  }

  private get premiumConfig() {
    const { query, store } = this.ctx
    const premiumConfig = this.filterKeys.reduce((acc, cur) => {
      if (getFirstQuery(query[cur])) {
        acc[cur] = getFirstQuery(query[cur])
      }
      return acc
    }, {})

    return _.isEmpty(premiumConfig)
      ? (store.state as InsuranceVuexState).insurance.filter
          .defaultPremiumConfig
      : premiumConfig
  }
}

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance extends Vue {
  $store: Store<InsuranceVuexState>
}

export interface Data {}

export type Methods = {
  toPage(index: number): void
}

export interface Computed {}

export interface Props {}

export interface InsuranceVuexState extends GlobalVuexState {
  insurance: State
}

export default opinions
</script>
