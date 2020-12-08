<template>
  <div
    :class="{ selected: isSelected }"
    class="AnswerInteractionButton"
    @click="clickHandler"
  >
    <component :is="icon" />
    {{ buttonText }}
    <span v-if="count" class="ml-2">{{ count }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseComment from '@/components/base/icon/24/BaseComment.svg'
import BaseLike from '@/components/base/icon/24/BaseLike.svg'
import BaseDislike from '@/components/base/icon/24/BaseDislike.svg'

export type Type = 'like' | 'dislike' | 'response'
type ButtonTextType = '讚' | '不滿' | '留言'
type IconType = 'BaseLike' | 'BaseDislike' | 'BaseComment'

const ButtonText: Record<Type, ButtonTextType> = {
  like: '讚',
  dislike: '不滿',
  response: '留言',
}

const Icon: Record<Type, IconType> = {
  like: 'BaseLike',
  dislike: 'BaseDislike',
  response: 'BaseComment',
}

export default {
  components: {
    BaseComment,
    BaseLike,
    BaseDislike,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  computed: {
    icon() {
      return Icon[this.type]
    },
    buttonText() {
      return ButtonText[this.type]
    },
  },
  methods: {
    clickHandler() {
      this.$emit('action', this.type)
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

export type Methods = {
  clickHandler(): void
}

export interface Computed {
  icon: IconType
  buttonText: ButtonTextType
}

export interface Props {
  type: Type
  isSelected: boolean
  count: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.AnswerInteractionButton {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  user-select: none;
  cursor: pointer;

  > svg {
    margin-right: 6px;
  }

  &.selected {
    color: $primary-color;

    &::v-deep svg > path {
      fill: $primary-color;
    }
  }

  @include hover('_gray-secondary-darker', $has-svg: true);
}
</style>
