<template>
  <div
    v-if="msg"
    class="BaseInputErrorMessage"
    :style="{
      textAlign,
    }"
  >
    {{ msg }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  props: {
    msg: {
      type: String,
      default: '',
    },
    textAlign: {
      type: String,
      default: 'left',
    },
  },
} as ComponentOption

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

export interface Methods {}

export interface Computed {}

export interface Props {
  msg: string
  textAlign: Pick<CSSStyleDeclaration, 'textAlign'>
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BaseInputErrorMessage {
  color: $error-color;
  font-size: 0.875rem;
  font-weight: normal;
  padding-top: 8px;
}
</style>
