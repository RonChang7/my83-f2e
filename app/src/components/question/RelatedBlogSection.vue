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
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import RelatedSection from './RelatedSection.vue'
import { State } from '@/store/question/index'
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
      const { relatedBlogs } = this.$store.state.question as State
      return relatedBlogs || []
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
  relatedBlogs: RelatedBlog[]
}

export interface Props {
  maxPost: number
}
</script>
