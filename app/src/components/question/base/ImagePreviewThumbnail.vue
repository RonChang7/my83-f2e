<template>
  <div class="ImagePreviewThumbnail" :class="{ enableHover }">
    <BaseRoundClose
      v-if="showCloseButton"
      class="ImagePreviewThumbnail__button"
      @click.native="$emit('close')"
    />
    <figure>
      <BaseLazyImage
        class="ImagePreviewThumbnail__image"
        :image-url="imageUrl"
        :image-alt="imageAlt"
        :ignore-placeholder="true"
      />
    </figure>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import BaseRoundClose from '@/components/base/icon/18/BaseRoundClose.vue'

export default {
  components: {
    BaseLazyImage,
    BaseRoundClose,
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
    enableHover: {
      type: Boolean,
      default: true,
    },
    showCloseButton: {
      type: Boolean,
      default: false,
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
  enableHover: boolean
  showCloseButton: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
$--width: 100px;
$--border: 2px;

figure {
  margin: 0;
}

.ImagePreviewThumbnail {
  $self: &;

  flex: 0 0 auto;
  width: $--width;
  height: 100%;
  border: solid $--border $gray-quaternary;
  margin-bottom: 10px;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  &.enableHover {
    #{$self}__image {
      transition: 0.3s;
    }

    @include hover-supported {
      #{$self}__image:hover {
        opacity: 0.3;
      }
    }
  }

  &__button {
    position: absolute;
    margin-left: calc(#{$--width} - #{$--border} * 2 - 9px);
    margin-top: -9px;
    z-index: 1;
    cursor: pointer;

    &::v-deep circle {
      transition: 0.3s;
    }

    @include hover-supported {
      &:hover {
        &::v-deep circle {
          fill: $gray-primary;
        }
      }
    }
  }

  img {
    width: 100%;
  }
}
</style>
