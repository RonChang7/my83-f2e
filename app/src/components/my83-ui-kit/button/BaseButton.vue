<template>
  <component
    :is="to ? 'GlobalLink' : 'button'"
    :class="classObject"
    :disabled="isDisabled || state === 'loading'"
    :to="to"
    type="button"
    class="BaseButton"
  >
    <span
      :class="{ hasIcon: hasIcon, isLoading: isLoading || state === 'loading' }"
      class="BaseButton__text"
    >
      <span v-if="hasIcon" :class="{ BaseButton__icon: hasIcon }">
        <slot name="icon"></slot>
      </span>
      <slot></slot>
    </span>
    <LoadingIcon
      v-if="isLoading || state === 'loading'"
      :class="[`BaseButton__${size}__loading`, `BaseButton__${type}__loading`]"
    />
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { RawLocation } from 'vue-router'
import LoadingIcon from '@/components/base/loading/LoadingIcon.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { isSlotExist } from '@/utils/render-helper'

export default {
  components: {
    LoadingIcon,
    GlobalLink,
  },
  props: {
    to: {
      type: [String, Object, null],
      default: null,
    },
    size: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'primary',
    },
    state: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isFullWidth: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classObject() {
      return {
        [`BaseButton__${this.size}`]: !this.isFullWidth,
        [`BaseButton__${this.size}__fullWidth`]: this.isFullWidth,
        [`BaseButton__${this.type}`]: true,
        [`BaseButton__${this.type}__disabled`]: this.isLoading,
      }
    },
    hasIcon() {
      return isSlotExist('icon', this)
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

export type Methods = {}

export interface Computed {
  classObject: Record<string, boolean>
  hasIcon: boolean
}

export interface Props {
  to: RawLocation | null
  size: 's' | 'm' | 'l-a' | 'l-b' | 'xl'
  type: 'primary' | 'secondary' | 'tertiary' | 'quaternary'
  state: string
  isLoading: boolean
  isFullWidth: boolean
  isDisabled: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixins.scss';

@mixin loading($font-size) {
  font-size: $font-size;
}

@mixin loading-color($color) {
  border-top-color: $color;
}

.BaseButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @each $size, $value in $button-height {
    &__#{$size} {
      @include button($size);
    }

    &__#{$size}__fullWidth {
      @include button-full-width($size);
    }

    &::v-deep &__#{$size}__loading {
      @include loading(map-get($button-font, $size));

      position: absolute;
    }
  }

  &__primary {
    @include button-primary;

    &::v-deep &__loading {
      @include loading-color($primary-button-text-color);
    }
  }

  &__secondary {
    @include button-secondary;

    &::v-deep &__loading {
      @include loading-color($secondary-button-text-color);
    }
  }

  &__tertiary {
    @include button-tertiary;

    &::v-deep &__loading {
      @include loading-color($tertiary-button-text-color);
    }
  }

  &__quaternary {
    @include button-quaternary;

    &::v-deep &__loading {
      @include loading-color($quaternary-button-text-color);
    }
  }

  &__text {
    display: flex;
    align-items: center;
    justify-content: center;

    &.hasIcon {
      position: relative;
      right: 3%;
    }

    &.isLoading {
      height: 0;
      overflow: hidden;
    }
  }

  &__icon {
    display: flex;
    margin-right: 4px;
  }
}
</style>
