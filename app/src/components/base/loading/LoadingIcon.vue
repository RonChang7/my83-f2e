<template functional>
  <div
    :style="[
      data.style,
      data.staticStyle,
      {
        'font-size': props.size,
        'border-top-color': props.color,
      },
    ]"
    :class="[data.class, data.staticClass]"
    class="loader"
  />
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
  fontSize: string
  color: string
}
</script>

<style lang="scss" scoped>
.loader {
  font-size: 18px;
  width: 1em;
  height: 1em;
  border-top: 0.1em solid rgba(0, 0, 0, 0.5);
  border-right: 0.1em solid transparent;
  border-radius: 50%;
  animation: rotation 0.8s linear infinite;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
