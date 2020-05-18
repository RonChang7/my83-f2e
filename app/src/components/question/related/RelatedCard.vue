<template>
  <div class="RelatedCard" :class="{ last }">
    <div class="RelatedCard__index">{{ index }}</div>
    <div class="RelatedCard__content">
      <div class="RelatedCard__title">{{ title }}</div>
      <div class="RelatedCard__meta">
        <span class="RelatedCard__count">
          <BaseView />
          {{ numberTransform(viewCount) }}
        </span>
        <span v-if="answerCount !== null" class="RelatedCard__count">
          <BaseComment />
          {{ numberTransform(answerCount) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseView from '@/components/base/icon/18/BaseView.vue'
import BaseComment from '@/components/base/icon/18/BaseComment.vue'
import { delimitIntegerWithSymbol } from '@/utils/digital'

export default {
  components: {
    BaseView,
    BaseComment,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    viewCount: {
      type: Number,
      required: true,
    },
    answerCount: {
      type: Number,
      default: null,
    },
    last: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    numberTransform(number) {
      return delimitIntegerWithSymbol(number)
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

export interface Methods {
  numberTransform(number: number): string
}

export interface Computed {}

export interface Props {
  index: number
  title: string
  viewCount: number
  answerCount: number
  last: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.RelatedCard {
  $self: &;

  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid $gray-quaternary;

  &.last {
    border-bottom: 0;
  }

  &:hover {
    #{$self}__title {
      color: $primary-color;
    }
  }

  @include max-media('xl') {
    padding: 10px;
  }

  &__index {
    color: $primary-color;
    font-size: 1.25rem;
    font-weight: 500;
    padding-right: 22px;
    max-width: 33px;

    @include max-media('xl') {
      font-size: 1rem;
      max-width: 25px;
      padding-right: 15px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
  }

  &__title {
    color: $gray-primary;
    margin: 2px 0 6px;

    @include max-media('xl') {
      margin-top: 0;
    }
  }

  &__meta {
    display: flex;
    color: $text-default-color;
  }

  &__count {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    margin-right: 20px;

    @include max-media('xl') {
      margin-right: 30px;
    }

    &::v-deep svg {
      margin-right: 6px;

      > path {
        fill: $gray-tertiary;
      }
    }
  }
}
</style>
