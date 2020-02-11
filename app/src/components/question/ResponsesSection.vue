<template>
  <div v-if="responses.length" class="ResponsesSection">
    <ResponseSection
      v-for="(response, index) in responses"
      :key="response.response_id"
      :response="response"
      :index="index"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import ResponseSection from './ResponseSection.vue'
import { Response } from '@/api/question/question.type'

export default {
  components: {
    ResponseSection,
  },
  props: {
    responses: {
      type: Array,
      required: true,
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
  responses: Response[]
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.ResponsesSection {
  padding-left: 40px;
  border-top: 1px solid $gray-quaternary;
}
</style>
