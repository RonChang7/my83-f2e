<template>
  <div class="AskingFormImagePreview">
    <ImagePreviewThumbnail
      v-for="image in images"
      :key="image.id"
      class="AskingFormImagePreview__preview"
      :class="{ error: !!error[image.id] }"
      :image-url="image.src"
      :enable-hover="false"
      :show-close-button="true"
      @close="$emit('remove-image', image.id)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import ImagePreviewThumbnail from '../../base/ImagePreviewThumbnail.vue'
import {
  PreviewImage,
  ValidateMessage,
} from '@/services/question/UploadImageService'

const options: ComponentOption = {
  components: {
    ImagePreviewThumbnail,
  },
  props: {
    images: {
      type: Array as PropType<Props['images']>,
      default: () => [],
    },
    error: {
      type: Object as PropType<Props['error']>,
      default: () => {},
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

export interface Methods {}

export interface Computed {}

export interface Props {
  images: PreviewImage[]
  error: Record<string, ValidateMessage> | {}
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.AskingFormImagePreview {
  display: flex;
  flex-wrap: wrap;
  margin-top: 25px;

  &__preview {
    user-select: none;

    &.error {
      border-width: 3px;
      border-color: $error-light-color;
    }
  }
}
</style>
