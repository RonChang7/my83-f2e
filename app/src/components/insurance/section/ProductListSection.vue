<template>
  <div class="ProductListSection">
    <slot />
    <div ref="listWrapper" class="ProductListSection__listWrapper">
      <div
        v-if="isLoading"
        class="mask"
        :style="{ height: `${mask.height}px` }"
      >
        <span>載入中</span>
      </div>
      <ProductCard
        v-for="(product, index) in insuranceProducts"
        :key="product.url || index"
        class="ProductListSection__product"
        :product="product"
      />
      <ProductListNoResult
        v-if="!isLoading && !insuranceProducts.length"
        :is-empty-search-result="isEmptySearchResult"
      />
    </div>
    <div v-if="insuranceProducts.length" class="ProductListSection__disclaimer">
      本網站商品資訊僅供參考，實際內容以保險公司公開資訊為準。
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import {
  IdealCoverage,
  InsuranceProduct,
  InsuranceSearchProduct,
} from '@/api/insurance/insurance.type'
import { EventTypes } from '@/analytics/event-listeners/event.type'
import { isSlotExist } from '@/utils/render-helper'
import { InsuranceListType } from '@/routes/insurance'
import CoverageBadge from '../coverages/CoverageBadge.vue'
import ProductCard from '../product/ProductCard.vue'
import ProductListNoResult from '../product/ProductListNoResult.vue'

const options: ComponentOption = {
  components: {
    ProductCard,
    CoverageBadge,
    ProductListNoResult,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isEmptySearchResult: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mask: {
        height: 0,
      },
    }
  },
  computed: {
    idealCoverages() {
      return this.$store.state.insurance.insuranceIdealCoverages || []
    },
    insuranceProducts() {
      return this.$store.state.insurance.insuranceSearchProduct || []
    },
    hasAd() {
      return isSlotExist('ad', this)
    },
    isInsurancePage() {
      return (
        this.$route.name === InsuranceListType.NORMAL ||
        this.$route.name === InsuranceListType.EXTERNAL
      )
    },
  },
  methods: {
    isEnabled(product) {
      return product.fee !== null
    },
    isNuxtLink(path) {
      const matches = this.$router.getMatchedComponents(path)
      return !_.isEmpty(matches)
    },
    clickProductCard(product) {
      if (this.isNuxtLink(product.btn?.link?.path)) {
        this.$router.push(product.btn.link.path)
      } else if (product.url) {
        // 處理 insuranceSearchProduct 類型的產品
        this.$router.push(product.url)
      } else if (product.btn?.link?.url) {
        window.location.href = product.btn.link.url
      }
    },
    clickProductButton(productName) {
      if (!this.isInsurancePage) return

      const insuranceType = this.$store.state.insurance.staticData.abbr

      this.$analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '險種頁商品CTA',
        action: '全部商品',
        label: `${insuranceType} ${productName}`,
      })
    },
    updateMaskHeight() {
      if (process.server) return

      this.$nextTick(() => {
        if (this.$refs.listWrapper) {
          this.mask.height = parseInt(
            window.getComputedStyle(this.$refs.listWrapper).height
          )
        }
      })
    },
  },
  watch: {
    insuranceProducts: {
      immediate: true,
      handler() {
        this.updateMaskHeight()
      },
    },
    isLoading(newVal) {
      if (newVal) {
        this.updateMaskHeight()
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

export interface Instance extends Vue {
  $store: Store<InsuranceVuexState>
  $refs: {
    listWrapper: HTMLElement
  }
}

export interface Data {
  mask: {
    height: number
  }
}

export type Methods = {
  isEnabled(product: InsuranceProduct | InsuranceSearchProduct): boolean
  isNuxtLink(path: string): boolean
  clickProductCard(product: InsuranceProduct | InsuranceSearchProduct): void
  clickProductButton(productName: string): void
  updateMaskHeight(): void
}

export interface Computed {
  idealCoverages: IdealCoverage[]
  insuranceProducts: (InsuranceProduct | InsuranceSearchProduct)[]
  hasAd: boolean
  isInsurancePage: boolean
}

export interface Props {
  isLoading: boolean
  isEmptySearchResult: boolean
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductListSection {
  margin-top: 20px;

  &__idealCoverage {
    @include card-primary;

    display: flex;
    align-items: center;
    padding: 12px 30px;
    margin-bottom: 16px;

    @include max-media('xl') {
      @include card-secondary;

      flex-direction: column;
      align-items: flex-start;
      padding: 12px 20px;
      margin-bottom: 10px;
    }

    &__title {
      color: $gray-primary;
      margin-right: 20px;
      font-weight: 500;

      @include max-media('xl') {
        font-size: 0.875rem;
        margin: 0 0 12px 0;
      }

      > span {
        color: $secondary-color;
      }
    }

    &__wrapper {
      display: flex;
    }

    &__chart {
      &:not(:last-child) {
        margin-right: 12px;
      }

      @include max-media('xl') {
        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
  }

  &__product {
    &.enabled {
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  @include max-media('xl') {
    margin-top: 8px;

    &__product:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  &__ad {
    margin-top: -10px;
  }

  &__disclaimer {
    padding-top: 16px;
    font-size: 0.75rem;
    color: $gray-secondary;

    @include max-media('xl') {
      padding: 10px 16px 30px;
    }
  }

  .mask {
    width: 836px;
    background: rgba($primary-bg, 0.8);
    position: absolute;
    border-radius: 4px;
    z-index: 1;

    > span {
      @include shadow('01');

      position: absolute;
      left: calc(50% - 75px);
      top: calc(50% - 30px);
      background: #fff;
      padding: 16px 48px;
      border-radius: 60px;
      font-size: 1.125rem;
      font-weight: 500;
      color: $gray-primary;
    }
  }
}
</style>
