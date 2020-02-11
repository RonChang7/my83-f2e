<template>
  <div :class="{ selected: isSelected }" class="AnswerInteractionButton">
    <!-- eslint-disable-next-line vue/require-component-is -->
    <component :is="icon" />
    {{ buttonText }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
const BaseComment = () => import('@/components/base/icon/24/BaseComment.vue')
const BaseLike = () => import('@/components/base/icon/24/BaseLike.vue')
const BaseUnlike = () => import('@/components/base/icon/24/BaseUnlike.vue')

type Type = 'like' | 'unlike' | 'response'
type ButtonTextType = '讚' | '不滿' | '留言'
type IconType = 'BaseLike' | 'BaseUnlike' | 'BaseComment'

const ButtonText: Record<Type, ButtonTextType> = {
  like: '讚',
  unlike: '不滿',
  response: '留言',
}

const Icon: Record<Type, IconType> = {
  like: 'BaseLike',
  unlike: 'BaseUnlike',
  response: 'BaseComment',
}

export default {
  components: {
    BaseComment,
    BaseLike,
    BaseUnlike,
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
  },
  computed: {
    icon() {
      return Icon[this.type]
    },
    buttonText() {
      return ButtonText[this.type]
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
  icon: IconType
  buttonText: ButtonTextType
}

export interface Props {
  type: Type
  isSelected: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

// @todo: 補上 interaction color change
.AnswerInteractionButton {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  cursor: pointer;

  > svg {
    margin-right: 6px;
  }

  &:hover {
    color: $gray-primary;

    > svg > ptah {
      stroke: $gray-primary;
    }
  }

  &:active,
  &.selected {
    color: $primary-color;

    > svg > ptah {
      stroke: $primary-color;
    }
  }
}
</style>
