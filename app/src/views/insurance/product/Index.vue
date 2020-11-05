<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { FETCH_PRODUCT } from '@/store/insurance/product.type'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/insurance/product'
import { ErrorPageType } from '@/config/error-page.config'
import { Content } from '@/services/page/Content'
import { OnProductOfflineException } from '@/api/errors/OnProductOfflineException'
import { ADD_CUSTOM_ERROR_PAGE_CTA } from '@/store/global/global.type'
const InsuranceProductComponent = () => import('./InsuranceProduct.vue')

@Component({
  async asyncData(ctx) {
    const { store, params, error } = ctx
    const insuranceProductStore = (store.state as InsuranceProductVuexState)
      .insuranceProduct

    const fetchPageData: Promise<any>[] = []

    if (insuranceProductStore.id !== params.id) {
      fetchPageData.push(
        store.dispatch(`insuranceProduct/${FETCH_PRODUCT}`, params.id)
      )
    }

    try {
      await Promise.all([...Content.requests(ctx), ...fetchPageData])
    } catch (err) {
      if (err instanceof OnProductOfflineException) {
        const linkButton = err.getLinkButton()
        store.dispatch(`global/${ADD_CUSTOM_ERROR_PAGE_CTA}`, linkButton)
        return error({
          statusCode: 404,
          message: ErrorPageType.PRODUCT,
        })
      }

      const statusCode = err.response.status === 404 ? err.response.status : 500
      const message =
        err.response.status === 404
          ? ErrorPageType.PRODUCT
          : ErrorPageType.SERVER

      return error({
        statusCode,
        message,
      })
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
