<template>
  <div class="AnswerInteraction">
    <AnswerInteractionButton type="like" />
    <AnswerInteractionButton type="unlike" />
    <AnswerInteractionButton type="response" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AnswerInteractionButton from './AnswerInteractionButton.vue'

export default {
  components: {
    AnswerInteractionButton,
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
@import '@/sass/variables.scss';

.AnswerInteraction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  margin-top: 16px;
  padding: 0 160px;
  border-top: 1px solid $gray-quaternary;
}
</style>
