<template functional>
  <div
    :style="[
      data.style,
      data.staticStyle,
      { 'font-size': `${props.fontSize ? props.fontSize : '10px'}` },
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
}
</script>

<style lang="scss" scoped>
.loader,
.loader:after {
  border-radius: 50%;
  width: 1em;
  height: 1em;
}

.loader {
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border: 0.3em solid rgba(255, 255, 255, 0.2);
  border-left: 0.3em solid #fff;
  transform: translateZ(0);
  animation: load 1.1s infinite linear;
}

@keyframes load {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
