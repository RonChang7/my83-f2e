<template>
  <div class="ProductCoverageCard">
    <div class="ProductCoverageCard__header">
      <h3 class="ProductCoverageCard__name">
        {{ coverage.name }}
      </h3>
      <div class="ProductCoverageCard__amount">
        {{ numberConverter(coverage.amount) }} 元
      </div>
    </div>
    <div v-if="coverageRate" class="ProductCoverageCard__coverage">
      <Ring
        :length="isMobile ? 60 : 70"
        :line-width="isMobile ? 4 : 5"
        :percentage="coverageRate"
        :wording="`${coverageRate}%`"
      />
      <div class="ProductCoverageCard__coverageWording">
        與
        <span>{{ idealCoverageWording }}</span>
        的比例
      </div>
    </div>
    <div class="ProductCoverageCard__content">
      {{ coverage.content }}
    </div>
    <div
      v-if="coverage.levels && coverage.levels.length"
      v-show="isActive"
      class="ProductCoverageCard__level__wrapper"
    >
      <div
        v-for="(level, index) in coverage.levels"
        :key="index"
        class="ProductCoverageCard__level"
      >
        <div class="ProductCoverageCard__level__name">{{ level.name }}</div>
        <div class="ProductCoverageCard__level__amount">
          {{ level.amount }} 元
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Coverage } from '@/api/insurance/product.type'
import Ring from '@/components/base/progress/Ring.vue'
import DeviceMixin from '@/mixins/device/device-mixins'

@Component({
  components: {
    Ring,
  },
})
export default class ProductCoverageCard extends Mixins(DeviceMixin) {
  @Prop({ required: true })
  coverage!: Coverage

  @Prop({ default: false })
  isActive!: boolean

  numberConverter(number: number) {
    const cutPoint = 100000
    return number >= cutPoint ? `${number / 10000}萬` : `${number}`
  }

  get coverageRate() {
    return this.coverage.ideal_amount
      ? Math.round((this.coverage.amount / this.coverage.ideal_amount) * 100)
      : 0
  }

  get idealCoverageWording() {
    return `MY83 建議理想保額 ${this.numberConverter(
      this.coverage.ideal_amount
    )} 元`
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductCoverageCard {
  @include card-primary;

  padding: 20px 30px;

  @include max-media('xl') {
    @include card-secondary;

    padding: 16px 20px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__name,
  &__amount {
    font-size: 1.125rem;
    font-weight: 500;
  }

  &__name {
    margin: 0;
    color: $gray-primary;
  }

  &__amount {
    color: $primary-color;
  }

  &__coverage {
    display: flex;
    align-items: center;
    color: $secondary-color;
    font-size: 1.125rem;
    margin-bottom: 16px;

    @include max-media('xl') {
      font-size: 1rem;
      padding-top: 8px;
    }
  }

  &__coverageWording {
    padding-left: 20px;
    font-size: 0.75rem;

    > span {
      background: $secondary-bright-color;
      padding: 4px 10px;
      border-radius: 1rem;
      font-weight: 500;
    }
  }

  &__content {
    font-size: 0.875rem;
  }

  &__level {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid $gray-quaternary;
    padding: 8px 0 8px 16px;

    &__wrapper {
      margin-top: 20px;
    }

    &__name {
      color: $gray-primary;
    }

    &__amount {
      color: $primary-color;
      font-weight: 500;
    }
  }
}
</style>
