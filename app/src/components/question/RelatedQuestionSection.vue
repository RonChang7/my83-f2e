<template>
  <RelatedSection
    v-if="relatedQuestions.length"
    :related-data="relatedQuestions"
    :max-post="maxPost"
    title="相關問答"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import RelatedSection from './RelatedSection.vue'
import { State } from '@/store/question/index'
import { RelatedQuestion } from '@/api/question/question.type'

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
    relatedQuestions() {
      const { relatedQuestions } = this.$store.state.question as State
      return relatedQuestions || []
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
  relatedQuestions: RelatedQuestion[]
}

export interface Props {
  maxPost: number
}
</script>
