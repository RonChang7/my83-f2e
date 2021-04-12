<template>
  <div class="ProductListSection">
    <slot />
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
      :class="{ enabled: isEnabled(product) }"
      :product="product"
      :enabled="isEnabled(product)"
      @click-button="
        isEnabled(product)
          ? clickProductButton(`${product.company}${product.name}`)
          : null
      "
      @click.native="isEnabled(product) ? clickProductCard(product) : null"
    />
    <div v-if="!insuranceProducts.length" class="ProductListSection__noResult">
      <img
        :src="`${$imageBucketUrl}/front/insurance/filter-not-found@2x.png`"
        alt="filter not fount"
      />
      <div class="title">沒有符合條件的商品</div>
      <div class="description">
        換個篩選條件試試看吧！調整保險種類、保障類型、商品類型等項目。
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { IdealCoverage, InsuranceProduct } from '@/api/insurance/insurance.type'
import { EventTypes } from '@/analytics/event-listeners/event.type'
import CoverageBadge from '../coverages/CoverageBadge.vue'
import ProductCard from '../product/ProductCard.vue'

const options: ComponentOption = {
  components: {
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
    isEnabled(product) {
      return product.fee !== null
    },
    clickProductCard(product) {
      const { isExternal } = this.$store.state.insurance.staticData
      if (isExternal) {
        window.location.href = product.btn.link.url
      } else {
        this.$router.push(product.btn.link.path)
      }
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
  isEnabled(product: InsuranceProduct): boolean
  clickProductCard(product: InsuranceProduct): void
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

  &__noResult {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 64px;

    @include max-media('xl') {
      padding: 0 20px;
    }

    img {
      width: 160px;
      height: 160px;
      margin-bottom: 10px;
    }

    .title {
      color: $gray-primary;
      font-size: 1.125rem;
      font-weight: 500;
    }

    .description {
      font-size: 0.875rem;
    }
  }
}
</style>
