<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { ErrorPageType } from '@/config/error-page.config'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/question/question'
import { Content } from '@/services/page/Content'
const InsurancePage = () => import('./InsurancePage.vue')

const opinions: ComponentOption = {
  async asyncData(ctx) {
    const { error } = ctx

    try {
      await Promise.all([...Content.requests(ctx)])
    } catch (err) {
      const statusCode = err.response.status === 404 ? err.response.status : 500

      return error({
        statusCode,
        message: ErrorPageType.SERVER,
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

export interface QuestionVuexState extends GlobalVuexState {
  question: State
}

export default opinions
</script>
