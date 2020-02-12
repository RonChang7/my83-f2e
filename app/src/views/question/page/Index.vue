<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import {
  FETCH_QUESTION_DATA,
  FETCH_ANSWER_DATA,
} from '@/store/question/question.type'
const QuestionPage = () => import('./QuestionPage.vue')

export default {
  async fetch({ store, route }) {
    const id = route.params.id
    await Promise.all([
      store.dispatch(`question/${FETCH_QUESTION_DATA}`, id),
      store.dispatch(`question/${FETCH_ANSWER_DATA}`, id),
    ])
  },
  render(h) {
    return h(QuestionPage)
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
</script>
