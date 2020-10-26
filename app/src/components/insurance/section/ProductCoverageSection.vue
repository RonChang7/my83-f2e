<template>
  <div class="ProductCoverageSection">
    <div class="ProductCoverageSection__header">
      <h2 class="ProductCoverageSection__title">理賠項目</h2>
      <div
        class="ProductCoverageSection__action"
        @click="isPanelActive = !isPanelActive"
      >
        {{ panelActionText }}
        <BaseArrowTop v-if="isPanelActive" />
        <BaseArrowDown v-else />
      </div>
    </div>
    <div class="ProductCoverageSection__row">
      <div
        v-for="column in columnNumber"
        :key="column"
        class="ProductCoverageSection__column"
      >
        <ProductCoverageCard
          v-for="(coverage, index) in filteredCoverages(column - 1)"
          :key="index"
          class="card"
          :coverage="coverage"
          :is-active="isPanelActive"
        />
      </div>
    </div>
    <div class="ProductCoverageSection__row">
      <div v-if="claims.length" class="ProductCoverageSection__claim">
        <h3>其他理賠說明</h3>
        <ul>
          <li v-for="(claim, index) in claims" :key="index">{{ claim }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ProductCoverageCard from '../product/ProductCoverageCard.vue'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import BaseArrowDown from '@/components/base/icon/24/BaseArrowDown.vue'
import BaseArrowTop from '@/components/base/icon/24/BaseArrowTop.vue'

@Component({
  components: {
    BaseArrowDown,
    BaseArrowTop,
    ProductCoverageCard,
  },
})
export default class ProductCoverageSection extends Vue {
  isPanelActive: boolean = false

  columnNumber: number = 2

  get panelActionText() {
    return this.isPanelActive ? '收合細項' : '查看細項'
  }

  get claims() {
    return (
      (this.$store.state as InsuranceProductVuexState).insuranceProduct.product
        ?.claims || []
    )
  }

  filteredCoverages(filterIndex: number) {
    const coverages = (this.$store.state as InsuranceProductVuexState)
      .insuranceProduct.product?.coverages

    return coverages
      ? coverages.filter(
          (_, index) => index % this.columnNumber === filterIndex
        )
      : []
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.ProductCoverageSection {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__title {
    margin: 0;
    color: $gray-primary;
    font-size: 1.375rem;
    font-weight: 500;
  }

  &__action {
    @include hover('_secondary', $has-svg: true);

    display: flex;
    align-items: center;
    cursor: pointer;

    > svg {
      margin-left: 4px;
    }
  }

  &__row {
    display: flex;
  }

  &__column {
    width: 100%;

    &:not(:last-child) {
      margin-right: 10px;
    }

    .card {
      margin-bottom: 10px;
    }
  }

  &__claim {
    @include card-primary;

    width: 100%;
    padding: 20px 30px;
    color: $gray-primary;

    h3 {
      margin: 0;
      margin-bottom: 12px;
      font-size: 1.125rem;
      font-weight: 500;
    }

    ul {
      margin: 0;
      padding-left: 1.5em;
    }
  }
}
</style>
