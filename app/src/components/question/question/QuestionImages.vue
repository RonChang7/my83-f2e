<template>
  <div class="QuestionImages">
    <PhotoSwipeGallery
      :index.sync="currentImageIndex"
      :images="galleryImages"
      thumbnail-class-name="QuestionImages__Thumbnail"
    />
    <QuestionThumbnail
      v-for="(image, index) in images"
      :key="index"
      :imageUrl="image"
      :imageAlt="image"
      @click.native="currentImageIndex = index"
      class="QuestionImages__Thumbnail"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionThumbnail from './QuestionThumbnail.vue'
const PhotoSwipeGallery = () =>
  import('@/components/base/gallery/PhotoSwipeGallery.vue')

export default {
  components: {
    QuestionThumbnail,
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

  &__Thumbnail {
    cursor: pointer;
  }
}
</style>
