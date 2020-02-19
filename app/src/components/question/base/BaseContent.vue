<template functional>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="BaseContent" v-html="props.content" />
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

.BaseContent {
  color: $gray-primary;
  margin-bottom: 24px;
  line-height: 2;
  overflow-y: auto;
}
</style>
