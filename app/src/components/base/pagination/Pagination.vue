<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Pagination } from '@/api/type'
import { renderlessComponentWrapper } from '@/utils/render-helper'

const options: ComponentOption = {
  props: {
    pagination: {
      type: Object as PropType<Props['pagination']>,
      required: true,
    },
  },
  methods: {
    toPreviousPage() {
      if (this.pagination.currentPage <= 0) return
      this.toPage(this.pagination.currentPage - 1)
    },
    toNextPage() {
      if (this.pagination.currentPage >= this.pagination.totalPage) return
      this.toPage(this.pagination.currentPage + 1)
    },
    toPage(index) {
      this.$emit('to-page', index)
    },
  },
  computed: {
    slot() {
      return {
        toPreviousPage: this.toPreviousPage,
        toNextPage: this.toNextPage,
        toPage: this.toPage,
      }
    },
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

export interface Data {}

export interface Methods {
  toPreviousPage(): void
  toNextPage(): void
  toPage(index: number): void
}

export interface Computed {
  slot: {
    toPreviousPage: Methods['toPreviousPage']
    toNextPage: Methods['toNextPage']
    toPage: Methods['toPage']
  }
}

export interface Props {
  pagination: Pagination
}

export default options
</script>
