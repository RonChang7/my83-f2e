<template>
  <div class="BaseCard">
    <div v-if="hasTitle" class="BaseCard__title">
      <slot name="title"></slot>
    </div>
    <div class="BaseCard__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { isSlotExist } from '@/utils/render-helper'

export default {
  computed: {
    hasTitle() {
      return isSlotExist('title', this)
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
}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';
@import '@/sass/mixins.scss';

.BaseCard {
  @include card-primary;

  & > * {
    padding: 0 30px;
  }

  &__title {
    display: flex;
    align-items: center;
    color: $gray-primary;
    height: 50px;
    border-bottom: 1px solid $gray-quaternary;
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
  }
}
</style>
