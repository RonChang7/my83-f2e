<template>
  <div class="ProductCoverageSection">
    <div class="ProductCoverageSection__header">
      <h2 class="ProductCoverageSection__title">理賠項目</h2>
      <div
        v-if="shouldShowCoverageDetail"
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
        v-for="columnIndex in columnCount"
        :key="columnIndex"
        class="ProductCoverageSection__column"
      >
        <ProductCoverageCard
          v-for="(coverage, rowIndex) in coverageGroup[columnIndex - 1]"
          :key="rowIndex"
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
import { Coverage } from '@/api/insurance/product.type'
import BaseArrowDown from '@/assets/icon/24/BaseArrowDown.svg'
import BaseArrowTop from '@/assets/icon/24/BaseArrowTop.svg'

@Component({
  components: {
    BaseArrowDown,
    BaseArrowTop,
    ProductCoverageCard,
  },
})
export default class ProductCoverageSection extends Vue {
  isPanelActive: boolean = false

  columnCount: number = 2

  get panelActionText() {
    return this.isPanelActive ? '收合細項' : '查看細項'
  }

  get claims() {
    return (
      (this.$store.state as InsuranceProductVuexState).insuranceProduct.product
        ?.claims || []
    )
  }

  get shouldShowCoverageDetail() {
    const coverages = (this.$store.state as InsuranceProductVuexState)
      .insuranceProduct.product?.coverages

    return !!coverages?.find((coverage) => coverage.levels.length > 0)
  }

  get coverageGroup() {
    const coverages = (this.$store.state as InsuranceProductVuexState)
      .insuranceProduct.product?.coverages

    return coverages
      ? coverages.reduce<Array<Array<Coverage>>>((acc, cur, index) => {
          if (typeof acc[index % this.columnCount] === 'undefined')
            acc[index % this.columnCount] = []

          acc[index % this.columnCount].push(cur)
          return acc
        }, [])
      : []
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductCoverageSection {
  @include max-media('xl') {
    width: 100vw;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    @include max-media('xl') {
      padding: 0 20px;
    }
  }

  &__title {
    margin: 0;
    color: $gray-primary;
    font-size: 1.375rem;
    font-weight: 500;

    @include max-media('xl') {
      font-size: 1.25rem;
    }
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

    @include max-media('xl') {
      flex-direction: column;
    }
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

    @include max-media('xl') {
      @include card-secondary;

      width: 100vw;
      padding: 16px 20px;
    }

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
