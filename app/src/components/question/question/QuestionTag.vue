<template functional>
  <span class="QuestionTag">
    {{ props.text }}
  </span>
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
  color: $secondary-color;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 24px;

  &:hover {
    color: $secondary-hover-color;
  }
}
</style>
