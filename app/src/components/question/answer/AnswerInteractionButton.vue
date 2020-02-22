<template>
  <div
    :class="{ selected: isSelected }"
    class="AnswerInteractionButton"
    @click="clickHandler"
  >
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
const BaseDislike = () => import('@/components/base/icon/24/BaseDislike.vue')

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
@import '@/sass/rwd.scss';

.AnswerInteractionButton {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
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

  @include min-media('xl') {
    &:hover {
      color: $gray-primary;

      &::v-deep svg > path {
        fill: $gray-primary;
      }
    }
  }
}
</style>
