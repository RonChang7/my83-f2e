<template>
  <div :id="`answer-${answer.answer_id}`" class="AnswerSection">
    <div v-if="shouldShowAnswerCount" class="AnswerSection__title">
      共 {{ answerCount }} 則留言
    </div>
    <div class="AnswerSection__header">
      <BaseAuthorInfo :authorInfo="answer.author_info" />
    </div>
    <BaseContent :content="answer.content" />
    <BaseMeta
      :likeCount="answer.answer_meta.like_count"
      :dislikeCount="answer.answer_meta.dislike_count"
      :answerCount="answer.answer_meta.response_count"
      :createdAt="answer.created_at"
      meta-type="answer"
    />
    <AnswerInteraction />
    <ResponsesSection :responses="answer.responses" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseAuthorInfo from './base/BaseAuthorInfo.vue'
import AnswerInteraction from './answer/AnswerInteraction.vue'
import ResponsesSection from './ResponsesSection.vue'
import BaseContent from './base/BaseContent.vue'
import BaseMeta from './base/BaseMeta.vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import { AnswerData } from '@/api/question/question.type'

export default {
  components: {
    BaseCard,
    BaseAuthorInfo,
    BaseContent,
    BaseMeta,
    AnswerInteraction,
    ResponsesSection,
  },
  props: {
    answer: {
      type: Object,
      required: true,
    },
    shouldShowAnswerCount: {
      type: Boolean,
      default: false,
    },
    answerCount: {
      type: Number,
      default: 0,
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

export interface Computed {}

export interface Props {
  answer: AnswerData
  shouldShowAnswerCount: boolean
  answerCount: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.AnswerSection {
  @include card-primary;

  display: flex;
  flex-direction: column;
  width: 740px;
  padding: 0 30px;
  margin-bottom: 20px;

  &__title {
    display: flex;
    align-items: center;
    color: $gray-primary;
    height: 50px;
    border-bottom: 1px solid $gray-quaternary;
    margin: 0 -30px;
    padding: 0 30px;
  }

  &__header {
    margin: 30px 0 15px;
  }
}
</style>
