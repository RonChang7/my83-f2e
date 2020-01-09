<template>
  <div :class="classObject" class="BaseBadge">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    activeHover: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    classObject() {
      return {
        [`BaseBadge__${this.type}`]: true,
        [`BaseBadge__${this.type}--hover`]: this.activeHover,
      }
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
  classObject: Record<string, boolean>
}

export interface Props {
  type: 'primary'
  activeHover: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.BaseBadge {
  @include badge;

  &__primary {
    $self: &;
    background-color: $primary-color;
    color: #fff;

    &--hover {
      &:hover {
        background: $primary-hover-color;
      }
    }
  }
}
</style>
