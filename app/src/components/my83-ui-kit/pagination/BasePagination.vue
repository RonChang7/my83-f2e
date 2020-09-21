<template>
  <Pagination
    v-slot="{ toPreviousPage, toNextPage, toPage }"
    :pagination="pagination"
    @to-page="(index) => $emit('to-page', index)"
  >
    <div class="BasePagination">
      <BaseArrowLeft
        v-if="shouldShowPreviousButton"
        class="BasePagination__prev"
        @click.native="toPreviousPage"
      />
      <span
        v-for="page in paginationPages"
        :key="page"
        class="BasePagination__page"
        :class="{
          active: page === pagination.currentPage,
          link: typeof page === 'number' && page !== pagination.currentPage,
        }"
        @click="navigateToPage(page, toPage)"
        v-text="page"
      />
      <BaseArrowRight
        v-if="shouldShowNextButton"
        class="BasePagination__next"
        @click.native="toNextPage"
      />
    </div>
  </Pagination>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import Pagination from '@/components/base/pagination/Pagination.vue'
import BaseArrowLeft from '@/components/base/icon/24/BaseArrowLeft.vue'
import BaseArrowRight from '@/components/base/icon/24/BaseArrowRight.vue'

const options: ComponentOption = {
  components: {
    Pagination,
    BaseArrowLeft,
    BaseArrowRight,
  },
  props: {
    pagination: {
      type: Object as PropType<Props['pagination']>,
      required: true,
    },
    // maxPages must be odd number
    maxPages: {
      type: Number,
      default: 5,
      validator: (value) => value > 0 && !!(value % 2),
    },
  },
  computed: {
    paginationPages() {
      const pages: number[] = []
      const halfMaxPages = (this.maxPages - 1) / 2
      pages.push(this.pagination.currentPage)

      for (let i = 0; i < halfMaxPages; i++) {
        if (pages[0] - 1 <= 0) {
          if (pages[pages.length - 1] === this.pagination.totalPage) continue

          pages.push(pages[pages.length - 1] + 1)
        } else {
          pages.unshift(pages[0] - 1)
        }
      }

      for (let i = 0; i < halfMaxPages; i++) {
        if (pages[pages.length - 1] + 1 > this.pagination.totalPage) {
          if (pages[0] === 1) continue

          pages.unshift(pages[0] - 1)
        } else {
          pages.push(pages[pages.length - 1] + 1)
        }
      }

      if (pages[0] !== 1) {
        pages[0] = 1
        return pages.reduce<(number | string)[]>((acc, cur, index) => {
          acc.push(cur)
          if (index === 0) {
            acc.push('...')
          }
          return acc
        }, [])
      }

      return pages
    },
    shouldShowPreviousButton() {
      return this.pagination.currentPage !== 1
    },
    shouldShowNextButton() {
      return this.pagination.currentPage !== this.pagination.totalPage
    },
  },
  methods: {
    navigateToPage(page, cb) {
      if (typeof page === 'number' && page !== this.pagination.currentPage) {
        cb(page)
      }
    },
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

export type Methods = {
  navigateToPage(page: number, cb: Function): void
}

export interface Computed {
  paginationPages: (number | string)[]
  shouldShowPreviousButton: boolean
  shouldShowNextButton: boolean
}

export interface Props {
  pagination: Pagination
  maxPages: number
}

interface Pagination {
  totalPage: number
  currentPage: number
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BasePagination {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;

  &__prev,
  &__next,
  &__page.link {
    cursor: pointer;
  }

  &__prev,
  &__next {
    &:hover {
      &::v-deep {
        > path {
          fill: $gray-primary;
        }
      }
    }
  }

  &__page.link {
    &:hover {
      color: $gray-primary;
    }
  }

  &__page {
    margin: 0 18px;

    &.active {
      color: $primary-color;
      border-bottom: 2px solid $primary-color;
    }
  }

  &__prev {
    margin-right: 10px;
  }

  &__next {
    margin-left: 10px;
  }
}
</style>
