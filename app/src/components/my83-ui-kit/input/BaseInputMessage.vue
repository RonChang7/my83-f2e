<template functional>
  <div
    v-if="props.msg"
    :class="[data.class, data.staticClass, props.type ? props.type : 'error']"
    class="BaseInputMessage"
    :style="[
      data.style,
      data.staticStyle,
      {
        'text-align': props.textAlign,
      },
    ]"
  >
    <span>{{ props.msg }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  functional: true,
} as ComponentOption

export type ComponentOption = FunctionalComponentOptions<Props>

export type ComponentInstance = CombinedVueInstance<Instance, {}, {}, {}, Props>

export interface Instance extends Vue {}

export interface Props {
  msg: string
  type: 'error' | 'legend'
  textAlign: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit'
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BaseInputMessage {
  font-size: 0.875rem;
  font-weight: normal;
  padding-top: 8px;

  &.error {
    color: $error-color;
  }

  &.legend {
    color: $gray-secondary;
  }

  span {
    white-space: pre-line;
  }
}
</style>
