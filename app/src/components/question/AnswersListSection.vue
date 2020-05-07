<template>
  <div v-if="answers.length" class="AnswersListSection">
    <AnswerSection
      v-for="(answer, index) in answers"
      :key="answer.answer_id"
      :answer="answer"
      :should-show-answer-count="index === 0"
      :answer-count="answerCount"
      :is-best-answer="bestAnswerId === answer.answer_id"
      :is-question-author="isQuestionAuthor"
      :question-id="questionId"
      :user-role="userRole"
      :nickname="nickname"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
import { QuestionMeta, AnswerData } from '@/api/question/question.type'
import UserMetaMixin, {
  Computed as UserMetaMixinComputed,
} from '@/mixins/user/user-meta'
const AnswerSection = () => import('./answer/AnswerSection.vue')

export default {
  components: {
    AnswerSection,
  },
  mixins: [UserMetaMixin],
  computed: {
    answerCount() {
      return this.$store.state.question.question?.question_meta.answer_count
    },
    answers() {
      return this.$store.state.question.answers || []
    },
    bestAnswerId() {
      return this.$store.state.question.question?.best_answer_id
    },
    isQuestionAuthor() {
      return this.$store.state.question.question?.personalize?.is_owner || false
    },
    questionId() {
      return this.$store.state.question.question?.question_id
    },
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

export interface Instance extends Vue {
  $store: Store<QuestionVuexState>
}

export interface Data {}

export interface Methods {}

export interface Computed extends UserMetaMixinComputed {
  answerCount: QuestionMeta['answer_count']
  answers: AnswerData[]
  bestAnswerId: boolean
  isQuestionAuthor: boolean
  questionId: number
}

export interface Props {}
</script>

<style lang="scss" scoped>
.AnswersListSection {
  flex: 0 0 auto;
}
</style>
