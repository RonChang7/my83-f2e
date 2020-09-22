<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { ErrorPageType } from '@/config/error-page.config'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/insurance/insurance'
import { Content } from '@/services/page/Content'
import { FETCH_PAGE_DATA } from '@/store/insurance/insurance.type'
const InsurancePage = () => import('./InsurancePage.vue')

const opinions: ComponentOption = {
  async asyncData(ctx) {
    const { error, route, store } = ctx
    const insurance = route.meta[route.meta.length - 1].insurance

    try {
      await Promise.all([
        ...Content.requests(ctx),
        store.dispatch(`insurance/${FETCH_PAGE_DATA}`, insurance),
      ])
    } catch (err) {
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
  },
  render(h) {
    return h(InsurancePage)
  },
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

export interface Methods {}

export interface Computed {}

export interface Props {}

export interface InsuranceVuexState extends GlobalVuexState {
  insurance: State
}

export default opinions
</script>
