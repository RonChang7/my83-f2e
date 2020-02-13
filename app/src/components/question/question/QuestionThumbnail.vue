<template>
  <figure class="QuestionThumbnail">
    <BaseLazyImage
      :image-url="imageUrl"
      :image-alt="imageAlt"
      :ignore-placeholder="true"
    />
  </figure>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'

export default {
  components: {
    BaseLazyImage,
  },
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    imageAlt: {
      type: String,
      default: '',
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
  imageUrl: string
  imageAlt: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

figure {
  margin: 0;
}

.QuestionThumbnail {
  flex: 0 0 auto;
  width: 100px;
  height: 100%;
  border: solid 2px $gray-quaternary;
  margin-bottom: 10px;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  img {
    width: 100%;
  }
}
</style>
