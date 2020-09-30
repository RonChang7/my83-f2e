<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
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
} from '@/store/insurance/insurance.type'
import { getFirstQuery } from '@/utils/query-string'
const InsurancePage = () => import('./InsurancePage.vue')

const opinions: ComponentOption = {
  watchQuery: ['page'],
  async asyncData(ctx) {
    const { error, route, query, store, redirect } = ctx
    const insurance = route.meta[route.meta.length - 1].insurance
    const insuranceStore = (store.state as InsuranceVuexState).insurance
    const currentInsurance = insuranceStore.id

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
      // @TODO: 補上 422 redirect error handler
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchList = (insurance: string, { query, store }: Context) => {
  const insuranceStore = (store.state as InsuranceVuexState).insurance
  const page = /^\d+$/.test(getFirstQuery(query.page))
    ? Number(getFirstQuery(query.page))
    : 1
  const currentParam = insuranceStore.currentParam
  const hasIdealCoverages = !!insuranceStore.insuranceIdealCoverages
  const currentInsurance = insuranceStore.id

  const payload: FetchInsuranceListPayload = {
    insurance,
    page,
    fetchIdealCoverages: hasIdealCoverages ? 0 : 1,
  }

  if (insurance !== currentInsurance || page !== currentParam.page) {
    return store.dispatch(`insurance/${FETCH_INSURANCE_LIST}`, payload)
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

export interface Instance extends Vue {}

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
