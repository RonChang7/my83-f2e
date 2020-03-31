<template>
  <RelatedSection
    v-if="relatedBlogs.length"
    :related-data="relatedBlogs"
    :max-post="maxPost"
    title="相關文章"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import RelatedSection from './related/RelatedSection.vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
import { RelatedBlog } from '@/api/question/question.type'

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
    relatedBlogs() {
      return this.$store.state.question.relatedBlogs || []
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
  relatedBlogs: RelatedBlog[]
}

export interface Props {
  maxPost: number
}
</script>
