<template>
  <div class="AddAnswerSection">
    <BaseButton size="l-b">我要留言</BaseButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'

export default {
  components: {
    BaseButton,
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

export interface Props {}
</script>

<style lang="scss" scoped>
.AddAnswerSection {
  display: flex;
  justify-content: center;
  padding: 20px 0 80px;
}
</style>
