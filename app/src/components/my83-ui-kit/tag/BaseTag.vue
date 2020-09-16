<template>
  <div :class="classObject" class="BaseTag">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

const options: ComponentOption = {
  props: {
    type: {
      type: String as () => Props['type'],
      default: 'default',
    },
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classObject() {
      return {
        [`BaseTag__${this.type}`]: true,
        active: this.active,
        disabled: this.disabled,
      }
    },
  },
}

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
  classObject: Record<string, boolean>
}

export interface Props {
  type: 'default'
  active: boolean
  disabled: boolean
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.BaseTag {
  @include tag;

  &__default {
    @include tag-default;
  }
}
</style>
