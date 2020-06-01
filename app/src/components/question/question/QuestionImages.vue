<template>
  <div class="QuestionImages">
    <PhotoSwipeGallery
      :index.sync="currentImageIndex"
      :images="galleryImages"
      thumbnail-class-name="QuestionImages__thumbnail"
    />
    <ImagePreviewThumbnail
      v-for="(image, index) in images"
      :key="index"
      :image-url="image"
      :image-alt="image"
      class="QuestionImages__thumbnail"
      @click.native="currentImageIndex = index"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import ImagePreviewThumbnail from '../base/ImagePreviewThumbnail.vue'
const PhotoSwipeGallery = () =>
  import('@/components/base/gallery/PhotoSwipeGallery.vue')

export default {
  components: {
    ImagePreviewThumbnail,
    PhotoSwipeGallery,
  },
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentImageIndex: null,
    }
  },
  computed: {
    galleryImages() {
      return this.images.map((image) => {
        return {
          src: image,
          msrc: image,
          w: 0,
          h: 0,
        }
      })
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

export interface Data {
  currentImageIndex: number | null
}

export interface Methods {}

export interface Computed {
  galleryImages: GalleryImage[]
}

export interface Props {
  images: string[]
}

export interface GalleryImage {
  src: string
  msrc: string
  h: number
  w: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.QuestionImages {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 44px;

  @include max-media('xl') {
    margin-bottom: 20px;
  }

  &__thumbnail {
    cursor: pointer;
  }
}
</style>
