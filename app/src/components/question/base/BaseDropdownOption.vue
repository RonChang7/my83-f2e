<template functional>
  <div class="BaseDropdownOption" v-on="listeners">
    {{ props.text }}
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
  text: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BaseDropdownOption {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  color: $gray-primary;
  background: #fff;
  cursor: pointer;

  &:hover {
    background: $primary-bg;
  }
}
</style>
