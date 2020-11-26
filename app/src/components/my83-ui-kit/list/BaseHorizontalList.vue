<template>
  <HorizontalList
    v-slot="{ previous, next, shouldDisplayPrevious, shouldDisplayNext }"
    list-element-name="BaseHorizontalList"
  >
    <div class="BaseHorizontalList__wrapper">
      <div
        ref="previousMask"
        class="BaseHorizontalList__mask previous"
        :class="{ hide: !shouldDisplayPrevious }"
        :style="previousMaskStyleObject"
      >
        <BaseArrowPrevious
          ref="previousIcon"
          :style="previousIconStyleObject"
          @click.native="previous"
        />
      </div>
      <div ref="list" class="BaseHorizontalList" :style="listStyleObject">
        <slot></slot>
        <span v-if="offset" :style="{ minWidth: `${offset}px` }"></span>
      </div>
      <div
        ref="nextMask"
        class="BaseHorizontalList__mask next"
        :class="{ hide: !shouldDisplayNext }"
        :style="nextMaskStyleObject"
      >
        <BaseArrowNext
          ref="nextIcon"
          :style="nextIconStyleObject"
          @click.native="next"
        />
      </div>
    </div>
  </HorizontalList>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import HorizontalList from '@/components/base/list/HorizontalList.vue'
import BaseArrowNext from '@/components/base/icon/others/BaseArrowNext.vue'
import BaseArrowPrevious from '@/components/base/icon/others/BaseArrowPrevious.vue'

@Component({
  components: {
    HorizontalList,
    BaseArrowNext,
    BaseArrowPrevious,
  },
})
export default class BaseHorizontalList extends Vue {
  @Prop({ type: Number, default: 0 })
  offset: number

  $refs: {
    previousMask: HTMLElement
    previousIcon: Vue
    list: HTMLElement
    nextMask: HTMLElement
    nextIcon: Vue
  }

  isMounted: boolean = false

  get listStyleObject(): Partial<CSSStyleDeclaration> {
    const originMargin = {
      left: 0,
      right: 0,
    }

    if (this.isMounted) {
      const listComputedStyle = window.getComputedStyle(this.$refs.list)
      originMargin.left = parseInt(listComputedStyle.marginLeft)
      originMargin.right = parseInt(listComputedStyle.marginRight)
    }

    return this.offset && this.isMounted
      ? {
          padding: `0 ${this.offset}px`,
          marginLeft: `${originMargin.left - this.offset}px`,
          marginRight: `${originMargin.right - this.offset}px`,
        }
      : {}
  }

  get previousMaskStyleObject(): Partial<CSSStyleDeclaration> {
    const originMaskWidth = this.isMounted
      ? parseInt(window.getComputedStyle(this.$refs.previousMask).width)
      : 0

    return this.offset && this.isMounted
      ? {
          marginLeft: `${-this.offset}px`,
          width: `${originMaskWidth + this.offset}px`,
        }
      : {}
  }

  get previousIconStyleObject(): Partial<CSSStyleDeclaration> {
    const originLeft = this.isMounted
      ? parseInt(window.getComputedStyle(this.$refs.previousIcon.$el).left)
      : 0

    return this.offset && this.isMounted
      ? {
          left: `${originLeft + this.offset / 2}px`,
        }
      : {}
  }

  get nextMaskStyleObject(): Partial<CSSStyleDeclaration> {
    const originMaskWidth = this.isMounted
      ? parseInt(window.getComputedStyle(this.$refs.nextMask).width)
      : 0

    return this.offset && this.isMounted
      ? {
          marginRight: `${-this.offset}px`,
          width: `${originMaskWidth + this.offset}px`,
        }
      : {}
  }

  get nextIconStyleObject(): Partial<CSSStyleDeclaration> {
    const originRight = this.isMounted
      ? parseInt(window.getComputedStyle(this.$refs.nextIcon.$el).right)
      : 0

    return this.offset && this.isMounted
      ? {
          right: `${originRight + this.offset / 2}px`,
        }
      : {}
  }

  mounted() {
    this.isMounted = true
  }
}
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
    justify-content: center;

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
          #{$position}: -95px;
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
