<template>
  <div class="LoginHeader">
    <div class="LoginHeader__back">
      <div
        v-if="displayBackButton"
        class="LoginHeader__back__button"
        @click="$emit('to-panel', 'login')"
      >
        <BaseArrowLeft />
        返回
      </div>
    </div>
    <div class="LoginHeader__close">
      <BaseClose @click.native="$emit('close')" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseClose from '@/assets/icon/24/BaseClose.svg'
import BaseArrowLeft from '@/assets/icon/24/BaseArrowLeft.svg'

export default {
  components: {
    BaseClose,
    BaseArrowLeft,
  },
  props: {
    displayBackButton: {
      type: Boolean,
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

export type Methods = {}

export interface Computed {}

export interface Props {
  displayBackButton: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.LoginHeader {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  @include max-media('lg') {
    margin-bottom: 0;
  }

  &__back,
  &__close {
    flex: 0 0 50%;

    &::v-deep svg {
      cursor: pointer;
    }
  }

  &__back {
    text-align: left;

    &__button {
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 0.875rem;
      cursor: pointer;

      @include hover('_gray-secondary-darker', $has-svg: true);
    }
  }

  &__close {
    text-align: right;

    @include hover('_gray-secondary-darker', $has-svg: true);
  }
}
</style>
