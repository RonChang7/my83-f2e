<template>
  <div class="ProductListSection">
    <h2 class="ProductListSection__title">
      全部商品
      <a
        class="ProductListSection__faq"
        href="#faq"
        @click.prevent="scrollToFAQ"
      >
        <BaseFAQ />
        常見問題
      </a>
    </h2>
    <div class="ProductListSection__description">
      依熱門度排序。費率以 30 歲女性為基準。
    </div>
    <div v-if="idealCoverages.length" class="ProductListSection__idealCoverage">
      <div class="ProductListSection__idealCoverage__title">
        <span>MY83 建議</span>
        理想保額
      </div>
      <div class="ProductListSection__idealCoverage__wrapper">
        <CoverageBadge
          v-for="(coverage, index) in idealCoverages"
          :key="index"
          class="ProductListSection__idealCoverage__chart"
          :percentage="100"
          :wording="coverage.amount"
          :legend="coverage.name"
        />
      </div>
    </div>
    <ProductCard
      v-for="product in insuranceProducts"
      :key="product.id"
      class="ProductListSection__product"
      :product="product"
      @click-button="clickProductButton(`${product.company}${product.name}`)"
      @click.native="$router.push(product.btn.link.path)"
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
import BaseFAQ from '@/assets/icon/24/BaseFAQ.svg'
import { scrollToElement } from '@/utils/scroll'
import { EventTypes } from '@/analytics/event-listeners/event.type'

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
    clickProductButton(productName) {
      const insuranceType = this.$store.state.insurance.staticData.abbr

      this.$analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '險種頁商品CTA',
        action: '全部商品',
        label: `${insuranceType} ${productName}`,
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
  clickProductButton(productName: string): void
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

.ProductListSection {
  margin-top: 30px;

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    color: $gray-primary;
    font-size: 1.75rem;
    font-weight: 500;

    > a {
      font-weight: 500;
      margin-right: 10px;

      @include hover('_secondary', $has-svg: true);

      @include max-media('xl') {
        margin: 0;
      }
    }
  }

  &__description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $gray-primary;
    margin-bottom: 20px;

    @include max-media('xl') {
      margin-top: 8px;
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

  &__product {
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
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
