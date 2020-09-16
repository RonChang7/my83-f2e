<template>
  <RelatedSection
    v-if="popularBlogs.length"
    :related-data="popularBlogs"
    :max-post="maxPost"
    title="熱門文章"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import RelatedSection from '../related/RelatedSection.vue'
import { QuestionListVuexState } from '@/views/question/list/CreateQuestionListPage'
import { PopularBlog } from '@/api/question/list.type'

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
    popularBlogs() {
      return this.$store.state.questionList.popularBlogs || []
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

export type Methods = {}

export interface Computed {
  popularBlogs: PopularBlog[]
}

export interface Props {
  maxPost: number
}
</script>
