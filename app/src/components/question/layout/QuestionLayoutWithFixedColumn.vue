<template>
  <div class="QuestionLayoutWithFixedColumn">
    <div ref="leftColumn" class="QuestionLayoutWithFixedColumn__column left">
      <slot name="left"></slot>
      <div ref="leftBottomOffset" class="offset">
        <slot name="left-bottom-offset"></slot>
      </div>
    </div>
    <div
      v-if="displayRightColumn"
      ref="rightColumn"
      class="QuestionLayoutWithFixedColumn__column right"
    >
      <div ref="wrapper" class="wrapper" :class="{ fixed: shouldFixedColumn }">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { isSlotExist } from '@/utils/render-helper'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

const options: ComponentOption = {
  mixins: [DeviceMixin],
  props: {
    displayRightColumn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      shouldFixedColumn: false,
      screenWidth: 0,
      scrollHeightBottom: 0,
      rightColumnHeight: 0,
      fixedColumn: {
        start: 0,
        end: 0,
      },
    }
  },
  methods: {
    calcRightColumnHeight() {
      if (this.$refs.wrapper) {
        this.rightColumnHeight =
          parseInt(window.getComputedStyle(this.$refs.wrapper).height) -
          parseInt(window.getComputedStyle(this.$refs.wrapper).paddingTop)
      }
    },
    getFixedColumnStart() {
      if (this.$refs.wrapper) {
        this.fixedColumn.start =
          this.$refs.rightColumn?.offsetTop +
          this.$refs.wrapper?.offsetHeight +
          60
      }
    },
  },
  computed: {
    hasLeftBottomOffsetSlot() {
      return isSlotExist('left-bottom-offset', this)
    },
  },
  beforeMount() {
    this.getScreenWidth = _.throttle(() => {
      this.screenWidth = window.innerWidth
    }, 200)

    this.getScrollHeightBottom = _.throttle(() => {
      const pageYScroll =
        window.pageYOffset || document.documentElement.scrollTop
      this.scrollHeightBottom = pageYScroll + window.innerHeight
    }, 200)
  },
  mounted() {
    this.getScreenWidth()

    this.calcRightColumnHeight()

    this.$nextTick(() => {
      this.getFixedColumnStart()
      this.getScrollHeightBottom()
    })

    this.isDesktop && window.addEventListener('resize', this.getScreenWidth)
    this.isDesktop &&
      window.addEventListener('scroll', this.getScrollHeightBottom, {
        passive: true,
      })
  },
  watch: {
    scrollHeightBottom(val: number) {
      if (!this.$refs.wrapper) return

      if (!this.isDesktop || this.screenWidth < 1200) {
        this.$refs.wrapper.style.cssText = ''
        this.shouldFixedColumn = false
        return
      }

      this.fixedColumn.end =
        this.$refs.leftColumn.offsetTop +
        this.$refs.leftColumn.offsetHeight +
        60

      if (this.hasLeftBottomOffsetSlot) {
        const el = this.$refs.leftBottomOffset
        const verticalMargin =
          parseFloat(window.getComputedStyle(el).marginTop) +
          parseFloat(window.getComputedStyle(el).marginBottom)

        this.fixedColumn.end -= el.offsetHeight + verticalMargin
      }

      if (val < this.fixedColumn.start) {
        this.$refs.wrapper.style.cssText = ''
        this.shouldFixedColumn = false
      } else if (val > this.fixedColumn.start && val < this.fixedColumn.end) {
        this.$refs.wrapper.style.cssText = ''
        this.shouldFixedColumn = true
      } else {
        const paddingTop = this.fixedColumn.end - this.fixedColumn.start
        this.shouldFixedColumn = false
        this.$refs.wrapper.style.paddingTop = `${paddingTop}px`
      }
    },
    rightColumnHeight() {
      this.$nextTick(() => {
        this.getFixedColumnStart()
      })
    },
  },
  beforeDestroy() {
    this.isDesktop && window.removeEventListener('resize', this.getScreenWidth)
    this.isDesktop &&
      window.removeEventListener('scroll', this.getScrollHeightBottom)
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

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue> {
  $refs: {
    wrapper: HTMLElement
    rightColumn: HTMLElement
    leftColumn: HTMLElement
    leftBottomOffset: HTMLElement
  }
  getScreenWidth(this: ComponentInstance): void
  getScrollHeightBottom(this: ComponentInstance): void
}

export interface Data {
  shouldFixedColumn: boolean
  screenWidth: number
  scrollHeightBottom: number
  rightColumnHeight: number
  fixedColumn: {
    start: number
    end: number
  }
}

export interface Methods {
  calcRightColumnHeight(): void
  getFixedColumnStart(): void
}

export interface Computed {
  hasLeftBottomOffsetSlot: boolean
}

export interface Props {
  displayRightColumn: boolean
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.QuestionLayoutWithFixedColumn {
  display: flex;
  justify-content: center;

  @include max-media('xl') {
    flex-direction: column;
  }

  &__column {
    display: flex;
    flex-direction: column;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }

    &.left {
      width: 740px;
    }

    &.right {
      width: 360px;

      .wrapper {
        width: inherit;

        &.fixed {
          position: fixed;
          bottom: 60px;
        }
      }
    }

    &.left,
    &.right {
      @include max-media('xl') {
        width: 100%;
      }
    }
  }
}
</style>
