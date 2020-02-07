<template>
  <div class="BaseMeta">
    <!-- @todo: 缺 icon -->
    <div class="BaseMeta__meta">
      {{ likeCount }}
      {{ dislikeCount }}
      {{ answerCount }}
    </div>
    <div class="BaseMeta__createdAt">{{ relativeTime }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { postingTimeParser } from '@/utils/time-parser'

export default {
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
      required: true,
    },
    createdAt: {
      type: Number,
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
  answerCount: number
  createdAt: number
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
    color: $gray-tertiary;
  }

  &__likeCount {
  }

  &__dislikeCount {
  }

  &__answerCount {
  }
}
</style>
