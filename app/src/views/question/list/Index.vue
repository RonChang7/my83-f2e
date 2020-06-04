<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/question/list'
import {
  FETCH_PAGE_DATA,
  FETCH_QUESTION_LIST,
} from '@/store/question/list.type'
import { FetchQuestionListPayload } from '@/api/question/list.type'
const ListPage = () => import('./QuestionListPage.vue')

export default {
  async middleware({ store }) {
    await store.dispatch(`questionList/${FETCH_PAGE_DATA}`)
    try {
      await store.dispatch(`questionList/${FETCH_QUESTION_LIST}`, {
        page: 1,
        sort: 'latest',
      } as FetchQuestionListPayload)
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
