<template functional>
  <div class="AskingFormBaseField">
    <div class="AskingFormBaseField__title">
      {{ props.title }}
      <span v-if="props.required">*</span>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

const options: ComponentOption = {
  functional: true,
  props: {
    title: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
}

export type ComponentOption = FunctionalComponentOptions<Props>

export type ComponentInstance = CombinedVueInstance<Instance, {}, {}, {}, Props>

export interface Instance extends Vue {}

export interface Props {
  title: string
  required: boolean
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.AskingFormBaseField {
  &__title {
    color: $gray-primary;
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 8px;
  }
}
</style>
