<template>
  <div class="BaseCard" :class="{ enableHover }">
    <div v-if="hasTitle" class="BaseCard__title">
      <slot name="title"></slot>
    </div>
    <div class="BaseCard__content">
      <slot></slot>
    </div>
    <div v-if="hasFooter" class="BaseCard__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { isSlotExist } from '@/utils/render-helper'

export default {
  props: {
    enableHover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasTitle() {
      return isSlotExist('title', this)
    },
    hasFooter() {
      return isSlotExist('footer', this)
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
  hasTitle: boolean
  hasFooter: boolean
}

export interface Props {
  enableHover: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';
@import '@/sass/mixins.scss';

.BaseCard {
  @include card-primary;
  $border-style: 1px solid $gray-quaternary;

  &.enableHover {
    @include min-media('md') {
      @include card-primary($hover: true);
    }
  }

  & > * {
    padding: 0 30px;
  }

  &__title {
    display: flex;
    align-items: center;
    color: $gray-primary;
    height: 50px;
    border-bottom: $border-style;
  }

  &__footer {
    display: flex;
    align-items: center;
    color: $gray-secondary;
    font-size: 0.875rem;
    padding-top: 0.875rem;
    padding-bottom: 0.875rem;
    border-top: $border-style;
  }

  @include max-media('md') {
    @include card-secondary;

    & > * {
      padding: 0 20px;
    }

    &__title {
      color: $gray-secondary;
      font-size: 0.875rem;
      height: 36px;
    }

    &__footer {
      font-size: 0.875rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
  }
}
</style>
