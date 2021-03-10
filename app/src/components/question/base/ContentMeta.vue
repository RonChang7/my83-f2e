<template>
  <div class="ContentMeta">
    <div class="ContentMeta__meta">
      <template v-if="metaType === 'question'">
        <div class="ContentMeta__count">
          <BaseComment />
          {{ answerCount }}
        </div>
      </template>
    </div>
    <div class="ContentMeta__createdAt">{{ relativeTime }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { postingTimeParser } from '@/utils/time-parser'
import BaseComment from '@/assets/icon/24/BaseComment.svg'
import { PostType } from '../helpers/type'

export default {
  components: {
    BaseComment,
  },
  props: {
    answerCount: {
      type: Number,
      default: null,
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

export type Methods = {}

export interface Computed {
  relativeTime: string
}

export interface Props {
  answerCount: number | null
  createdAt: number
  metaType: PostType
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.ContentMeta {
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
