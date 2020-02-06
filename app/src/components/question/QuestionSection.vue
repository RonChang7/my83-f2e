<template>
  <BaseCard class="QuestionSection">
    <QuestionAuthorInfo :avatar="avatar" :name="author" :target="targetTag" />
    <QuestionTitle :text="subject" />
    <QuestionContent :content="content" />
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionAuthorInfo from './question/QuestionAuthorInfo.vue'
import QuestionTitle from './question/QuestionTitle.vue'
import QuestionContent from './question/QuestionContent.vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import { State } from '@/store/question/index'
import { QuestionData, AuthorInfo } from '@/api/question/question.type'
import { nl2br } from '@/utils/text-parser'

export default {
  components: {
    BaseCard,
    QuestionAuthorInfo,
    QuestionTitle,
    QuestionContent,
  },
  computed: {
    subject() {
      const { question } = this.$store.state.question as State
      return question ? question.subject : ''
    },
    content() {
      const { question } = this.$store.state.question as State
      return question ? nl2br(question.content) : ''
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
}

export interface Props {}
</script>

<style lang="scss" scoped>
.QuestionSection {
  width: 740px;
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
