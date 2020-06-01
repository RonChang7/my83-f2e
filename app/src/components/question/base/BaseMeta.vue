<template>
  <div class="BaseMeta">
    <div class="BaseMeta__meta">
      <template v-if="metaType === 'question'">
        <div class="BaseMeta__count">
          <BaseComment24 />
          {{ answerCount }}
        </div>
      </template>
      <template v-else-if="metaType === 'answer'">
        <div class="BaseMeta__count">
          <BaseThumbUp />
          {{ likeCount }}
        </div>
        <div class="BaseMeta__count">
          <BaseThumbDown />
          {{ dislikeCount }}
        </div>
        <div class="BaseMeta__count">
          <BaseComment18 />
          {{ answerCount }}
        </div>
      </template>
    </div>
    <div class="BaseMeta__createdAt">{{ relativeTime }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { PostType } from '../helpers/type'
import { postingTimeParser } from '@/utils/time-parser'
const BaseThumbUp = () => import('@/components/base/icon/18/BaseThumbUp.vue')
const BaseThumbDown = () =>
  import('@/components/base/icon/18/BaseThumbDown.vue')
const BaseComment18 = () => import('@/components/base/icon/18/BaseComment.vue')
const BaseComment24 = () => import('@/components/base/icon/24/BaseComment.vue')

export default {
  components: {
    BaseThumbUp,
    BaseThumbDown,
    BaseComment18,
    BaseComment24,
  },
  props: {
    likeCount: {
      type: Number,
      default: null,
    },
    dislikeCount: {
      type: Number,
      default: null,
    },
    answerCount: {
      type: Number,
      required: null,
    },
    createdAt: {
      type: Number,
      required: true,
    },
    metaType: {
      type: String,
      required: true,
    },
  },
  computed: {
    relativeTime() {
      return postingTimeParser(this.createdAt)
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
  relativeTime: string
}

export interface Props {
  likeCount: number | null
  dislikeCount: number | null
  answerCount: number | null
  createdAt: number
  metaType: PostType
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BaseMeta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  font-size: 0.875rem;

  &__meta {
    display: flex;
    color: $gray-tertiary;
  }

  &__count {
    display: flex;
    align-items: center;
    margin-right: 24px;

    & > svg {
      margin-right: 6px;
    }
  }
}
</style>
