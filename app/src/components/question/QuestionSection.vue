<template>
  <div class="QuestionSection">
    <div class="QuestionSection__header">
      <QuestionAuthorInfo :avatar="avatar" :name="author" :target="targetTag" />
    </div>
    <QuestionTitle :text="subject" />
    <BaseContent :content="content" />
    <QuestionImages v-if="images.length" :images="images" />
    <QuestionTags v-if="tags.length" :tags="tags" icon-type="tag" />
    <QuestionTags
      v-if="companies.length"
      :tags="companies"
      icon-type="company"
    />
    <BaseMeta
      :created-at="createdAt"
      :answer-count="answerCount"
      meta-type="question"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionAuthorInfo from './question/QuestionAuthorInfo.vue'
import QuestionTitle from './question/QuestionTitle.vue'
import BaseContent from './base/BaseContent.vue'
import BaseMeta from './base/BaseMeta.vue'
import { State } from '@/store/question/index'
import {
  QuestionData,
  AuthorInfo,
  QuestionMeta,
} from '@/api/question/question.type'
import { textToUrl } from '@/utils/text-parser'
const QuestionImages = () => import('./question/QuestionImages.vue')
const QuestionTags = () => import('./question/QuestionTags.vue')

export default {
  components: {
    QuestionAuthorInfo,
    QuestionTitle,
    BaseContent,
    QuestionImages,
    QuestionTags,
    BaseMeta,
  },
  computed: {
    subject() {
      const { question } = this.$store.state.question as State
      return question ? question.subject : ''
    },
    content() {
      const { question } = this.$store.state.question as State
      return question ? textToUrl(question.content) : ''
    },
    avatar() {
      const { question } = this.$store.state.question as State
      return question ? question.author_info.avatar_url : ''
    },
    author() {
      const { question } = this.$store.state.question as State
      return question ? question.author_info.nickname : ''
    },
    targetTag() {
      const { question } = this.$store.state.question as State
      return question ? question.target_tag : {}
    },
    images() {
      const { question } = this.$store.state.question as State
      return question ? question.images : []
    },
    tags() {
      const { question } = this.$store.state.question as State
      return question ? question.tags : []
    },
    companies() {
      const { question } = this.$store.state.question as State
      return question ? question.companies : []
    },
    answerCount() {
      const { question } = this.$store.state.question as State
      return question ? question.question_meta.answer_count : 0
    },
    createdAt() {
      const { question } = this.$store.state.question as State
      return question ? question.created_at : 0
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
  subject: Pick<QuestionData, 'subject'>
  content: Pick<QuestionData, 'content'>
  avatar: Pick<AuthorInfo, 'avatar_url'>
  author: Pick<AuthorInfo, 'nickname'>
  targetTag: Pick<QuestionData, 'target_tag'>
  images: Pick<QuestionData, 'images'>
  tags: Pick<QuestionData, 'tags'>
  companies: Pick<QuestionData, 'companies'>
  answerCount: Pick<QuestionMeta, 'answer_count'>
  createdAt: Pick<QuestionData, 'created_at'>
}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/mixins.scss';

.QuestionSection {
  @include card-primary;

  flex: 1 0 auto;
  padding: 30px;
  margin-bottom: 20px;

  &__header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
