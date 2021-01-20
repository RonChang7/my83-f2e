<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { FETCH_PRODUCT } from '@/store/insurance/product.type'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/insurance/product'
import { ErrorPageType } from '@/config/error-page.config'
import { Content } from '@/services/page/Content'
import { isAxiosError } from '@/api/helper'
const InsuranceProductComponent = () => import('./InsuranceProduct.vue')

@Component({
  async asyncData(ctx) {
    const { store, params, error, from, route } = ctx
    const insuranceProductStore = (store.state as InsuranceProductVuexState)
      .insuranceProduct

    const fetchPageData: Promise<any>[] = []

    if (from?.name !== route?.name || insuranceProductStore.id !== params.id) {
      fetchPageData.push(
        store.dispatch(`insuranceProduct/${FETCH_PRODUCT}`, params.id)
      )
    }

    try {
      await Promise.all([...Content.requests(ctx), ...fetchPageData])
    } catch (err) {
      if (!isAxiosError(err)) throw err

      const statusCode =
        err.response?.status === 404 ? err.response.status : 500
      const message = statusCode ? ErrorPageType.PRODUCT : ErrorPageType.SERVER

      error({ statusCode, message })
    }
  },
  render(h) {
    return h(InsuranceProductComponent)
  },
})
export default class InsuranceProduct extends Vue {}

export interface InsuranceProductVuexState extends GlobalVuexState {
  insuranceProduct: State
}
</script>
