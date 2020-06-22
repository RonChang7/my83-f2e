<template>
  <RelatedSection
    v-if="popularQuestions.length"
    :related-data="popularQuestions"
    :max-post="maxPost"
    title="人氣問答"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import RelatedSection from '../related/RelatedSection.vue'
import { QuestionListVuexState } from '@/views/question/list/CreateQuestionListPage'
import { PopularQuestion } from '@/api/question/list.type'

export default {
  components: {
    RelatedSection,
  },
  props: {
    maxPost: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    popularQuestions() {
      return this.$store.state.questionList.popularQuestions || []
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
  $store: Store<QuestionListVuexState>
}

export interface Data {}

export interface Methods {}

export interface Computed {
  popularQuestions: PopularQuestion[]
}

export interface Props {
  maxPost: number
}
</script>
