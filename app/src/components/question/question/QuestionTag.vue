<template functional>
  <div class="QuestionTag">
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

.QuestionTag {
  display: inline-block;
  color: $secondary-color;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    color: $secondary-hover-color;
  }
}
</style>
