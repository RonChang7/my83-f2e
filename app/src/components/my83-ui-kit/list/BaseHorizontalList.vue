<template>
  <HorizontalList
    v-slot="{ previous, next, shouldDisplayPrevious, shouldDisplayNext }"
    list-element-name="BaseHorizontalList"
  >
    <div class="BaseHorizontalList__wrapper">
      <div
        :class="{ hide: !shouldDisplayPrevious }"
        class="BaseHorizontalList__mask previous"
      >
        <BaseArrowPrevious @click.native="previous" />
      </div>
      <div ref="list" class="BaseHorizontalList">
        <slot></slot>
      </div>
      <div
        :class="{ hide: !shouldDisplayNext }"
        class="BaseHorizontalList__mask next"
      >
        <BaseArrowNext @click.native="next" />
      </div>
    </div>
  </HorizontalList>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import HorizontalList from '@/components/base/list/HorizontalList.vue'
import BaseArrowNext from '@/components/base/icon/others/BaseArrowNext.vue'
import BaseArrowPrevious from '@/components/base/icon/others/BaseArrowPrevious.vue'

const options: ComponentOption = {
  components: {
    HorizontalList,
    BaseArrowNext,
    BaseArrowPrevious,
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

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

$positions: (
  'previous': left,
  'next': right,
);

@mixin horizontal-list-style($gradient-width) {
  @include hide-scrollbar;

  display: flex;
  overflow-y: auto;
  margin: 0 -#{$gradient-width};

  &__wrapper {
    display: flex;
  }

  &__mask {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    width: $gradient-width;

    ::v-deep > svg:hover {
      > path {
        fill: $gray-secondary;
      }
    }

    @each $key, $position in $positions {
      &.#{$key} {
        background: linear-gradient(
          to #{$position},
          rgba(255, 255, 255, 0) 0%,
          $primary-bg $gradient-width
        );

        > svg {
          position: relative;
          #{$position}: -90px;
          align-self: center;
          cursor: pointer;
        }
      }
    }

    &.hide {
      visibility: hidden;
    }
  }
}

.BaseHorizontalList {
  $gradient-width: 50px;
  @include horizontal-list-style($gradient-width);

  @include max-media('xl') {
    $gradient-width: 15px;
    @include horizontal-list-style($gradient-width);
  }
}
</style>
