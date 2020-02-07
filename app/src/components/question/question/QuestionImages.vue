<template>
  <div class="QuestionImages">
    <QuestionThumbnail
      v-for="(image, index) in images"
      :key="index"
      :imageUrl="image"
      :imageAlt="image"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionThumbnail from './QuestionThumbnail.vue'

export default {
  components: {
    QuestionThumbnail,
  },
  props: {
    images: {
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
  images: string[]
}
</script>

<style lang="scss" scoped>
.QuestionImages {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 44px;
}
</style>
