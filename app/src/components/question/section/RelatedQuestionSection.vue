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
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import RelatedSection from '@/components/base/related/RelatedSection.vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
import { RelatedQuestion } from '@/api/type'

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
      return this.$store.state.question.relatedQuestions || []
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

export type Methods = {}

export interface Computed {
  relatedQuestions: RelatedQuestion[]
}

export interface Props {
  maxPost: number
}
</script>
