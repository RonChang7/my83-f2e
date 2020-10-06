<template>
  <div class="ProductionLIstSection">
    <h2 class="ProductionLIstSection__title">全部商品</h2>
    <div class="ProductionLIstSection__description">
      依熱門度排序
      <a
        class="ProductionLIstSection__faq"
        href="#faq"
        @click.prevent="scrollToFAQ"
      >
        <BaseFAQ />
        常見問題
      </a>
    </div>
    <div
      v-if="idealCoverages.length"
      class="ProductionLIstSection__idealCoverage"
    >
      <div class="ProductionLIstSection__idealCoverage__title">
        <span>MY83 建議</span>
        理想保額
      </div>
      <div class="ProductionLIstSection__idealCoverage__wrapper">
        <CoverageBadge
          v-for="(coverage, index) in idealCoverages"
          :key="index"
          class="ProductionLIstSection__idealCoverage__chart"
          :percentage="100"
          :wording="coverage.amount"
          :legend="coverage.name"
        />
      </div>
    </div>
    <ProductCard
      v-for="product in insuranceProducts"
      :key="product.id"
      class="ProductionLIstSection__product"
      :product="product"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import ProductCard from '../product/ProductCard.vue'
import CoverageBadge from '../coverages/CoverageBadge.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { IdealCoverage, InsuranceProduct } from '@/api/insurance/insurance.type'
import BaseFAQ from '@/components/base/icon/24/BaseFAQ.vue'
import { scrollToElement } from '@/utils/scroll'

const options: ComponentOption = {
  components: {
    BaseFAQ,
    ProductCard,
    CoverageBadge,
  },
  computed: {
    idealCoverages() {
      return this.$store.state.insurance.insuranceIdealCoverages || []
    },
    insuranceProducts() {
      return this.$store.state.insurance.insuranceList || []
    },
  },
  methods: {
    scrollToFAQ() {
      scrollToElement({
        el: document.querySelector('#faq')! as HTMLElement,
        vertical: true,
        offset: 32,
      })
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
}

export interface Data {}

export type Methods = {
  scrollToFAQ(): void
}

export interface Computed {
  idealCoverages: IdealCoverage[]
  insuranceProducts: InsuranceProduct[]
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductionLIstSection {
  margin-top: 30px;

  &__title {
    margin: 0;
    color: $gray-primary;
    font-size: 1.75rem;
    font-weight: 500;
  }

  &__description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $gray-primary;
    margin-bottom: 20px;

    > a {
      font-weight: 500;
      color: $secondary-color;
      margin-right: 10px;

      ::v-deep svg > path {
        fill: $secondary-color;
      }

      @include hover-supported {
        &:hover {
          color: $secondary-hover-color;

          ::v-deep svg > path {
            fill: $secondary-hover-color;
          }
        }
      }
    }
  }

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

  &__faq {
    font-size: 1rem;
  }

  &__product:not(:last-child) {
    margin-bottom: 16px;
  }

  @include max-media('xl') {
    margin-top: 8px;

    &__title,
    &__description {
      padding: 0 20px;
    }

    &__title {
      font-size: 1.375rem;
    }

    &__description {
      font-size: 0.875rem;
      margin-bottom: 12px;
    }

    &__product:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
</style>
