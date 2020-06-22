<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { getScroll, getRect } from '@/utils/element'

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
    affixOffsetTop: {
      type: Number,
      default: 0,
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
        if (!target) return
        const el = this.$refs.placeholder
        if (!el) return

        const elRect = getRect(el)
        const targetRect = getRect(target)

        const scrollTop = getScroll(target, true)
        const scrollLeft = getScroll(target, false)

        const clientTop = window.document.body.clientTop || 0
        const clientLeft = window.document.body.clientLeft || 0

        const elOffset = {
          top: elRect.top - targetRect.top + scrollTop - clientTop,
          left: elRect.left - targetRect.left + scrollLeft - clientLeft,
          width: elRect.width,
          height: elRect.height,
        }

        if (scrollTop > elOffset.top - this.affixOffsetTop) {
          this.$set(this.contentStyle, 'position', 'fixed')
          this.$set(
            this.contentStyle,
            'top',
            `${targetRect.top + this.affixOffsetTop}px`
          )
          this.$set(
            this.contentStyle,
            'left',
            `${targetRect.left + elOffset.left}px`
          )
          this.$set(this.contentStyle, 'width', `${elOffset.width}px`)
          this.$set(this.placeholderStyle, 'width', `${elOffset.width}px`)
          this.$set(
            this.placeholderStyle,
            'height',
            `${this.$refs.placeholder.offsetHeight}px`
          )
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
            class: this.contentClass,
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

export interface Methods {
  syncPlaceholderStyle(): void
  updateAffixPosition(event?: Event): void
}

export interface Computed {}

export interface Props {
  placeholderTag: string
  placeholderClass: object | string
  contentTag: string
  contentClass: object | string
  affixOffsetTop: number
}

export default options
</script>
