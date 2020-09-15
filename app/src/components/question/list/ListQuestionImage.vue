<template>
  <div class="ListQuestionImage">
    <figure>
      <BaseLazyImage
        class="ImagePreviewThumbnail__image"
        :image-url="imageUrl"
        :image-alt="imageAlt"
        :image-loaded-style="{
          borderRadius: '4px',
        }"
        fit="cover"
      />
    </figure>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'

const options: ComponentOption = {
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
}

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

export type Methods = {}

export interface Computed {}

export interface Props {
  imageUrl: string
  imageAlt: string
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

figure {
  margin: 0;
}

.ListQuestionImage {
  flex: 0 0 auto;
  width: 80px;
  height: 80px;
  border: 2px solid $gray-quaternary;
  border-radius: 4px;

  @include max-media('xl') {
    width: 60px;
    height: 60px;
  }
}
</style>
