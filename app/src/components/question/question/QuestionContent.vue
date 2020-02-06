<template functional>
  <div v-html="props.content" class="QuestionContent" />
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
  content: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.QuestionContent {
  color: $gray-primary;
  margin-bottom: 24px;
}
</style>
