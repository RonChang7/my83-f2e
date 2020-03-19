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
import { UserRole } from '@/services/user/user'
const AnswerSection = () => import('./answer/AnswerSection.vue')

export default {
  components: {
    AnswerSection,
  },
  computed: {
    userRole() {
      const { headerPersonalized } = this.$store.state.header
      return headerPersonalized ? headerPersonalized.personalize.role : 'guest'
    },
    nickname() {
      const { headerPersonalized } = this.$store.state.header
      return headerPersonalized ? headerPersonalized.personalize.nickname : ''
    },
    answerCount() {
      const { question } = this.$store.state.question
      return question ? question.question_meta.answer_count : 0
    },
    answers() {
      const { answers } = this.$store.state.question
      return answers || []
    },
    bestAnswerId() {
      const { question } = this.$store.state.question
      return question ? question.best_answer_id : null
    },
    isQuestionAuthor() {
      const { question } = this.$store.state.question
      return question ? question.personalize?.is_owner : false
    },
    questionId() {
      const { question } = this.$store.state.question
      return question ? question.question_id : 0
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

export interface Computed {
  userRole: UserRole
  nickname: string
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
