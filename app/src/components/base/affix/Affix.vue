<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { getScroll, getRect } from '@/utils/dom'

let previousScrollTopPosition: number

const options: ComponentOption = {
  props: {
    placeholderTag: {
      type: String,
      default: 'div',
    },
    placeholderClass: {
      type: String,
      default: '',
    },
    contentTag: {
      type: String,
      default: 'div',
    },
    contentClass: {
      type: String,
      default: '',
    },
    fixedContentClass: {
      type: String,
      default: '',
    },
    affixOffsetTop: {
      type: Number,
      default: 0,
    },
    enableHideOnScrollDown: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      placeholderStyle: {},
      contentStyle: {},
    }
  },
  methods: {
    syncPlaceholderStyle() {
      if (_.isEmpty(this.contentStyle)) {
        return
      }

      this.$refs.placeholder.style.cssText = ''
      this.$set(
        this.placeholderStyle,
        'width',
        `${this.$refs.placeholder.offsetWidth}px`
      )
      this.$set(
        this.contentStyle,
        'width',
        `${this.$refs.placeholder.offsetWidth}px`
      )
    },
    updateAffixPosition(event?: Event) {
      window.requestAnimationFrame(() => {
        const target = window
        const el = this.$refs.placeholder
        if (!el) return

        const elRect = getRect(el)
        const targetRect = getRect(target)

        const scrollTop = getScroll(target, true) || 0
        const scrollLeft = getScroll(target, false) || 0

        const clientTop = window.document.body.clientTop || 0
        const clientLeft = window.document.body.clientLeft || 0

        const elOffset = {
          top: elRect.top - targetRect.top + scrollTop - clientTop,
          left: elRect.left - targetRect.left + scrollLeft - clientLeft,
          width: elRect.width,
          height: elRect.height,
        }

        if (scrollTop > elOffset.top - this.affixOffsetTop) {
          this.contentStyle = {
            ...this.contentStyle,
            position: 'fixed',
            top: `${targetRect.top + this.affixOffsetTop}px`,
            left: `${targetRect.left + elOffset.left}px`,
            width: `${elOffset.width}px`,
          }

          this.placeholderStyle = {
            ...this.placeholderStyle,
            width: `${elOffset.width}px`,
            height: `${this.$refs.placeholder.offsetHeight}px`,
          }

          this.updateHideOnScrollDownStyle()
        } else {
          this.placeholderStyle = {}

          if (
            event &&
            event.type === 'resize' &&
            !_.isEmpty(this.contentStyle) &&
            this.contentStyle.position === 'fixed' &&
            this.$refs.placeholder.offsetWidth
          ) {
            this.$set(
              this.contentStyle,
              'width',
              `${this.$refs.placeholder.offsetWidth}px`
            )
          } else {
            this.contentStyle = {}
          }
        }

        if (event && event.type === 'resize') {
          this.syncPlaceholderStyle()
        }
      })
    },
    updateHideOnScrollDownStyle() {
      if (this.enableHideOnScrollDown) {
        if (!previousScrollTopPosition) {
          previousScrollTopPosition = getScroll(window, true) || 0
        }

        const target = window
        const scrollTop = getScroll(target, true) || 0

        if (scrollTop > previousScrollTopPosition) {
          this.contentStyle = {
            ...this.contentStyle,
            visibility: 'hidden',
            transform: 'translateY(-60px)',
          }
        } else if (scrollTop < previousScrollTopPosition - 10) {
          this.contentStyle = {
            ...this.contentStyle,
            visibility: 'visible',
            transform: 'translateY(0px)',
          }
        }
        previousScrollTopPosition = scrollTop
      }
    },
  },
  computed: {
    currentContentClass() {
      return this.fixedContentClass && this.contentStyle.position === 'fixed'
        ? [this.contentClass, this.fixedContentClass]
        : [this.contentClass]
    },
  },
  mounted() {
    this.updateAffixPosition()
    window.addEventListener('scroll', this.updateAffixPosition, {
      passive: true,
    })
    window.addEventListener('resize', this.updateAffixPosition)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.updateAffixPosition)
    window.removeEventListener('resize', this.updateAffixPosition)
  },
  render(h) {
    return h(
      this.placeholderTag,
      {
        ref: 'placeholder',
        class: this.placeholderClass,
        style: this.placeholderStyle,
      },
      [
        h(
          this.contentTag,
          {
            ref: 'content',
            class: this.currentContentClass,
            style: this.contentStyle,
          },
          [this.$slots.default]
        ),
      ]
    )
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

export interface Instance extends Vue {
  $refs: {
    placeholder: HTMLElement
    content: HTMLElement
  }
}

export interface Data {
  placeholderStyle: Partial<CSSStyleDeclaration>
  contentStyle: Partial<CSSStyleDeclaration>
}

export type Methods = {
  syncPlaceholderStyle(): void
  updateAffixPosition(event?: Event): void
  updateHideOnScrollDownStyle(): void
}

export interface Computed {
  currentContentClass: string[]
}

export interface Props {
  placeholderTag: string
  placeholderClass: string
  contentTag: string
  contentClass: string
  fixedContentClass: string
  affixOffsetTop: number
  enableHideOnScrollDown: boolean
}

export default options
</script>
