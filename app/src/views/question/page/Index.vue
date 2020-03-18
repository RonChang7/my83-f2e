<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import {
  HIGHLIGHT_BEST_ANSWER,
  FETCH_QUESTION_PERSONALIZE_DATA,
  FETCH_ANSWER_PERSONALIZE_DATA,
  FETCH_PAGE_DATA,
} from '@/store/question/question.type'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/question/index'
import { User } from '@/services/user/user'
const QuestionPage = () => import('./QuestionPage.vue')
const user = User.getInstance()

export default {
  async middleware({ store, route, error }) {
    const id = Number(route.params.id)
    if (_.isNaN(id)) {
      return error({ statusCode: 404 })
    }

    // 如果回到同一篇 Question (相同 id)，則不重新打 API
    if (
      id === (store.state as QuestionVuexState).question.question?.question_id
    ) {
      return
    }

    try {
      await store.dispatch(`question/${FETCH_PAGE_DATA}`, id)
    } catch (err) {
      return error({
        statusCode: 404,
        message: 'question',
      })
    }

    const { question } = (store.state as QuestionVuexState).question

    if (question && question.best_answer_id) {
      store.dispatch(
        `question/${HIGHLIGHT_BEST_ANSWER}`,
        question.best_answer_id
      )
    }
  },
  mounted() {
    if (user.isLogin()) {
      const id = this.$route.params.id
      this.$store.dispatch(`question/${FETCH_QUESTION_PERSONALIZE_DATA}`, id)
      this.$store.dispatch(`question/${FETCH_ANSWER_PERSONALIZE_DATA}`, id)
    }
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

export interface QuestionVuexState extends GlobalVuexState {
  question: State
}
</script>
