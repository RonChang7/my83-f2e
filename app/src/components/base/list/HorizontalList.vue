<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { renderlessComponentWrapper } from '@/utils/render-helper'
import { scrollToPosition } from '@/utils/scroll'

let listElement: HTMLElement
const listSize = {
  width: 0,
  height: 0,
}

const options: ComponentOption = {
  props: {
    listElementName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      scrollWidth: 0,
      scrollLeft: 0,
    }
  },
  computed: {
    shouldDisplayNext() {
      return listSize.width + this.scrollLeft < this.scrollWidth
    },
    shouldDisplayPrevious() {
      return this.scrollLeft > 0
    },
    slot() {
      return {
        next: () => this.scrollTo(listElement.scrollLeft + listSize.width),
        previous: () => this.scrollTo(listElement.scrollLeft - listSize.width),
        shouldDisplayNext: this.shouldDisplayNext,
        shouldDisplayPrevious: this.shouldDisplayPrevious,
      }
    },
  },
  methods: {
    scrollTo(to) {
      scrollToPosition({
        to,
        container: listElement,
        vertical: false,
      })
    },
    updateScrollParams() {
      this.scrollWidth = listElement.scrollWidth
      this.scrollLeft = listElement.scrollLeft
    },
  },
  mounted() {
    this.$nextTick(() => {
      listElement = this.$el.querySelector(
        `.${this.listElementName}`
      ) as HTMLElement

      listSize.width = listElement.offsetWidth
      listSize.height = listElement.offsetHeight
      this.updateScrollParams()

      listElement.addEventListener('scroll', this.updateScrollParams, {
        passive: true,
      })
    })
  },
  beforeDestroy() {
    listElement.removeEventListener('scroll', this.updateScrollParams)
  },
  // @ts-ignore
  render(h) {
    if (this.$scopedSlots.default) {
      return renderlessComponentWrapper(this.$scopedSlots.default(this.slot), h)
    }
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

export interface Data {
  scrollWidth: number
  scrollLeft: number
}

export type Methods = {
  scrollTo(to: number): void
  updateScrollParams(): void
}

export interface Computed {
  shouldDisplayNext: boolean
  shouldDisplayPrevious: boolean
  slot: {
    next: Methods['scrollTo']
    previous: Methods['scrollTo']
    shouldDisplayNext: Computed['shouldDisplayNext']
    shouldDisplayPrevious: Computed['shouldDisplayPrevious']
  }
}

export interface Props {
  listElementName: string
}

export default options
</script>
