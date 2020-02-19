<template>
  <div v-if="answers.length" class="AnswersSection">
    <AnswerSection
      v-for="(answer, index) in answers"
      :key="answer.answer_id"
      :answer="answer"
      :should-show-answer-count="index === 0"
      :answer-count="answerCount"
      :is-best-answer="bestAnswerId === answer.answer_id"
      :is-question-author="isQuestionAuthor"
      :question-id="questionId"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { State } from '@/store/question/index'
import { QuestionMeta, AnswerData } from '@/api/question/question.type'
const AnswerSection = () => import('./AnswerSection.vue')

export default {
  components: {
    AnswerSection,
  },
  computed: {
    answerCount() {
      const { question } = this.$store.state.question as State
      return question ? question.question_meta.answer_count : 0
    },
    answers() {
      const { answers } = this.$store.state.question as State
      return answers || []
    },
    bestAnswerId() {
      const { question } = this.$store.state.question as State
      return question ? question.best_answer_id : null
    },
    isQuestionAuthor() {
      const { question } = this.$store.state.question as State
      return question ? question.personalize?.is_owner : false
    },
    questionId() {
      const { question } = this.$store.state.question as State
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

export interface Instance extends Vue {}

export interface Data {}

export interface Methods {}

export interface Computed {
  answerCount: Pick<QuestionMeta, 'answer_count'>
  answers: AnswerData[]
  bestAnswerId: boolean
  isQuestionAuthor: boolean
  questionId: number
}

export interface Props {}
</script>

<style lang="scss" scoped>
.AnswersSection {
  flex: 0 0 auto;
}
</style>
