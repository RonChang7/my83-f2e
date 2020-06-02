<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/question/list'
import { FETCH_PAGE_DATA } from '@/store/question/list.type'
const ListPage = () => import('./QuestionListPage.vue')

export default {
  async middleware({ store }) {
    try {
      await store.dispatch(`questionList/${FETCH_PAGE_DATA}`)
    } catch (error) {
      console.error(error)
    }
  },
  mounted() {},
  render(h) {
    return h(ListPage)
  },
} as ComponentOption

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

export interface QuestionListVuexState extends GlobalVuexState {
  questionList: State
}
</script>
