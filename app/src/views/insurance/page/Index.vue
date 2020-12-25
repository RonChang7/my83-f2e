<script lang="ts">
import _, { DebouncedFunc } from 'lodash'
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Context } from '@nuxt/types'
import { ErrorPageType } from '@/config/error-page.config'
import { GlobalVuexState } from '@/store/global-state'
import {
  State,
  UpdateInsuranceListFilterPayload,
} from '@/store/insurance/insurance'
import { Content } from '@/services/page/Content'
import { FetchInsuranceListPayload } from '@/api/insurance/insurance.type'
import {
  FETCH_PAGE_DATA,
  FETCH_INSURANCE_LIST,
  UPDATE_INSURANCE_LIST_PRODUCT_FEE,
  UPDATE_INSURANCE_LIST_FILTER,
  REMOVE_INSURANCE_LIST_FILTER,
} from '@/store/insurance/insurance.type'
import { getFirstQuery } from '@/utils/query-string'
import { OnRedirectingException } from '@/api/errors/OnRedirectingException'
const InsurancePage = () => import('./InsurancePage.vue')

const opinions: ComponentOption = {
  watchQuery: ['page'],
  async asyncData(ctx) {
    const { error, route, query, store, redirect } = ctx
    const insurance = route.params.insurance
    const insuranceStore = (store.state as InsuranceVuexState).insurance
    const currentInsurance = insuranceStore.staticData.id
    const previousFilterKeys = _.keys(
      insuranceStore.filter.defaultPremiumConfig
    )

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
      if (err instanceof OnRedirectingException) {
        const redirectLink = err.getRedirectLink()
        redirect(redirectLink)
        return
      }

      const statusCode = err.response.status === 404 ? err.response.status : 500
      const message =
        err.response.status === 404
          ? ErrorPageType.DEFAULT
          : ErrorPageType.SERVER

      return error({
        statusCode,
        message,
      })
    }

    updateCurrentParamFromQueryString(previousFilterKeys, ctx)

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
  computed: {
    currentParam() {
      return this.$store.state.insurance.currentParam
    },
    defaultPremiumConfig() {
      return this.$store.state.insurance.filter.defaultPremiumConfig
    },
    filterKeys() {
      return _.keys(this.$store.state.insurance.filter.defaultPremiumConfig)
    },
    isExternal() {
      return !!this.$store.state.insurance.filter.defaultPremiumConfig
    },
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
    updateInsuranceProductFee: _.debounce(function () {
      if (!this.isExternal) return

      let premiumConfig = this.filterKeys.reduce<
        Record<string, string | undefined>
      >((acc, key) => {
        acc[key] = this.currentParam[key].toString()
        return acc
      }, {})

      this.$store
        .dispatch(
          `insurance/${UPDATE_INSURANCE_LIST_PRODUCT_FEE}`,
          premiumConfig
        )
        .then(() => {
          const shouldRemoveFilterQueryString = this.filterKeys.every(
            (key) => premiumConfig[key] === this.defaultPremiumConfig![key]
          )

          if (shouldRemoveFilterQueryString) {
            premiumConfig = resetFilterQueryString(this.filterKeys)
          }

          this.$router.push({
            query: {
              ...this.$route.query,
              ...premiumConfig,
            },
          })
        })
    }),
  },
  watch: {
    currentParam: {
      deep: true,
      immediate: true,
      handler() {
        if (process.server) return
        this.updateInsuranceProductFee()
      },
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

const updateCurrentParamFromQueryString = (
  previousFilterKeys: string[],
  { store, query, redirect }: Context
) => {
  const insuranceStore = (store.state as InsuranceVuexState).insurance
  const isExternal = !!insuranceStore.filter.defaultPremiumConfig
  if (isExternal) {
    const filterKeys = _.keys(insuranceStore.filter.defaultPremiumConfig)

    filterKeys.forEach((id) => {
      const payload: UpdateInsuranceListFilterPayload = {
        id,
        value:
          getFirstQuery(query[id]) ||
          insuranceStore.filter.defaultPremiumConfig![id],
      }

      store.dispatch(`insurance/${UPDATE_INSURANCE_LIST_FILTER}`, payload)
    })

    const shouldRemoveFilterQueryString = filterKeys.every((key) => {
      return (
        insuranceStore.filter.defaultPremiumConfig![key] &&
        insuranceStore.filter.defaultPremiumConfig![key] === query[key]
      )
    })

    if (shouldRemoveFilterQueryString) {
      redirect({
        query: {
          ...query,
          ...resetFilterQueryString(filterKeys),
        },
      })
    }
  } else {
    store.commit(
      `insurance/${REMOVE_INSURANCE_LIST_FILTER}`,
      previousFilterKeys
    )
  }
}

const resetFilterQueryString = (filterKeys: string[]) =>
  filterKeys.reduce<Record<string, undefined>>((acc, key) => {
    acc[key] = undefined
    return acc
  }, {})

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
  updateInsuranceProductFee: DebouncedFunc<(this: ComponentInstance) => void>
  toPage(index: number): void
}

export interface Computed {
  currentParam: State['currentParam']
  filterKeys: string[]
  defaultPremiumConfig: State['filter']['defaultPremiumConfig']
  isExternal: boolean
}

export interface Props {}

export interface InsuranceVuexState extends GlobalVuexState {
  insurance: State
}

export default opinions
</script>
